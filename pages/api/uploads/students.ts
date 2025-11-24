import type { NextApiRequest, NextApiResponse } from 'next'
import { v4 as uuidv4 } from 'uuid'
import * as XLSX from 'xlsx';
import * as fs from 'fs';
import { IncomingForm } from 'formidable'; // For parsing multipart forms
import { Course, Grade, Student, Subject } from '@/libs/models';

// Disable Next.js body parser for file uploads
export const config = { api: { bodyParser: false } };

function getAdjustedYear() {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0 = January, 11 = December

    // Months are 0-indexed, so September is month 8
    if (currentMonth < 8) {
        // January to August → use previous year
        return currentYear - 1;
    } else {
        // September to December → use current year
        return currentYear;
    }
}

function convertWassceResults(inputString: string) {
  // Split by comma, then clean up each part
  return inputString
    .split(',')                          // split into individual subject-grade pairs
    .map(item => item.trim())            // remove extra spaces
    .filter(item => item.includes('-'))  // safety: make sure it has a dash
    .map(item => {
      const parts = item.split('-').map(p => p.trim()); // split by dash
      const subject = parts.slice(0, -1).join('-').trim(); // subject may contain dashes (e.g. ENGLISH LANG)
      const grade = parts[parts.length - 1];               // last part is always the grade
      return [subject.toUpperCase(), grade.toUpperCase()];
    });
}

function getCourseWithSubjectIds(myElectives: string[], courses: any) {
  const normalize = (str: string) => str.trim().toLowerCase().replace(/\s+/g, ' ');

  // Normalize your elective subjects for comparison
  const myElectiveNames = myElectives.map((s: any) => 
    typeof s === 'string' ? normalize(s) : normalize(s.name)
  );

  const result = [];

  for (const course of courses) {
    // Create a map: normalized name → original subject object (for ID access)
    const subjectMap = new Map();
    for (const sub of course.Subjects) {
      subjectMap.set(normalize(sub.name), sub);
    }

    // Check if ALL your electives exist in this course
    const missing = myElectiveNames.some(elective => !subjectMap.has(elective));
    if (missing) continue; // Skip this course if any elective is missing

    // All electives found → collect their IDs
    const matchedIds = myElectiveNames.map(electiveName => {
      return subjectMap.get(electiveName).id;
    });

    result.push({
      id: course.id,
      subjectIds: matchedIds
    });
  }

  return result;
}


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
    const form = new IncomingForm();
    const [fields, files] = await form.parse(req as any); // formidable parses req
    const file = Array.isArray(files.file) ? files.file[0] : files.file;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Read file buffer
    const buffer = await fs.promises.readFile(file.filepath);
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][];

    if (jsonData.length < 2) {
      return res.status(400).json({ error: 'Excel file is empty or missing headers' });
    }

    const headers = jsonData[0];
    const rows = jsonData.slice(1);
    if (headers[0] !== 'INDEX NUMBER' || headers[1] !== 'NAME' || headers[2] !== 'GENDER' || headers[3] !== 'RESULTS') {
      return res.status(400).json({ error: 'Invalid Excel headers' });
    }

    const courses = await Course.findAll({
      include: { model: Subject },
    })

    // console.log("rows:", rows.length)

    const processedRows: any[] = [];

    for (const row of rows) {
      if (row.length < 4 || !row[0] || !row[1] || !row[2] || !row[3]) continue;
      
      const indexNo = row[0].toString().trim();
      const name = row[1].toString().trim();
      const sex = row[2].toString().trim();
      const results = row[3].toString().trim();

      const wassceResults = convertWassceResults(results)

      const electives = [wassceResults[4][0], wassceResults[5][0], wassceResults[6][0], wassceResults[7][0]]

      const course = getCourseWithSubjectIds(electives, courses) 

      // Name manipulation
      const nameParts = name.split(' ').filter(part => part.length > 0);
      // console.log("nameParts:", nameParts)
      const firstName = nameParts[1] || '';
      const lastName = nameParts[0] || '';
      const otherName = nameParts.slice(2).join(' ') || '';

      processedRows.push({
        id: uuidv4(),
        indexNo: `0${indexNo}`,
        firstName: firstName,
        lastName: lastName,
        otherName: otherName,
        sex: sex.toLowerCase(),
        yearGroup: fields.yearGroup ? fields.yearGroup[0].toString() : getAdjustedYear(),
        courseId: course[0].id,
        subjectIds: course[0].subjectIds
      });
    }

    // console.log("processedRows:", processedRows.length)

    if (processedRows.length === 0) {
      return res.status(400).json({ error: 'No valid data to import' });
    } else {
      // console.log("processedRows:", processedRows.length)
      const students = []
      for (const row of processedRows) {
        const student = await Student.create({
          id: row.id,
          indexNo: row.indexNo,
          yearGroup: row.yearGroup,
          firstName: row.firstName,
          lastName: row.lastName,
          otherName: row.otherName,
          sex: row.sex,
          courseId: row.courseId,
        })

        const coreSubjects = await Subject.findAll({
          where: {
            type: 'core',
          },
        })

        for (let subject of coreSubjects) {
          await Grade.create({ id: uuidv4(), studentId: row.id, subjectId: subject.id })
        }

        await row.subjectIds.forEach((subjectId: string) => {
          Grade.create({ id: uuidv4(), studentId: row.id, subjectId })
        })

        students.push(student)
      }
      res.status(200).json({ response: students })
    }
    } catch (error) {
      console.error('Import error:', error);
      return res.status(500).json({ error: 'Failed to process file' });
    }
}
