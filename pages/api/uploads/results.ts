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
        const results = row[3].toString().trim();

        const wassceResults = convertWassceResults(results)

        const student: any = await Student.findOne({
          where: {
            indexNo: `0${indexNo}`
          },
          include: { model: Subject },
        })

        const subjects = student.Subjects
        // console.log("Subjects:", [...subjects])

        const gradesArray: any = []
        for (const subject of subjects) {
          const subResult = wassceResults.find(([result]: any) => 
            result.trim().toUpperCase() === subject.name.trim().toUpperCase()
          )
          if (subResult) {
            let status = ''
            let grade = subResult[1];
            const studentId = student.id
            const subjectId = subject.id
            if (
              subResult[1].toLowerCase() === 'withheld' ||
              subResult[1] === '*'
            ) {
              status = "Withheld"
              grade = ''
            } else if (subResult[1].toLowerCase() === 'canceled') {
              status = "Canceled"
              grade = ''
            } else if (subResult[1].toLowerCase() === 'absent') {
              status = "Absent"
              grade = ''
            }

            const response = await Grade.update(
              {
                grade,
                status,
              },
              {
                where: {
                  subjectId,
                  studentId,
                },
              }
            )
            
            // if (response === null || response === undefined) {
            //   return res.status(400).json({ error: 'Could not update student grade' });
            // }
            gradesArray.push({
              studentId: student.id,
              subjectId: subject.id,
              grade,
              status
            })
          }
        }
        processedRows.push({
          ...gradesArray
        });
      }

      if (processedRows.length === 0) {
        return res.status(400).json({ error: 'No valid data to import' });
      } else {
        const students = await Student.findAll({
          where: {
            yearGroup: fields.yearGroup ? fields.yearGroup[0].toString() : getAdjustedYear().toString()
          }
        })
        res.status(200).json({ response: students })
      }
    } catch (error) {
      console.error('Import error:', error);
      return res.status(500).json({ error: 'Failed to process file' });
    }
}