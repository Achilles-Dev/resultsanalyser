import type { NextApiRequest, NextApiResponse } from 'next'
import { Student, StudentSubject } from '@/libs/models'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    id,
    indexNo,
    yearGroup,
    firstName,
    lastName,
    otherName,
    sex,
    courseId,
    subjectIds,
  } = req.body
  const response = await Student.update(
    {
      indexNo,
      yearGroup,
      firstName,
      lastName,
      otherName,
      sex,
      courseId,
    },
    {
      where: {
        id,
      },
    }
  )
  const existingStudentSubjects = JSON.parse(
    JSON.stringify(
      await StudentSubject.findAll({
        where: { studentId: id },
      })
    )
  )
  const set = new Set(subjectIds)
  console.log(set, 'first', existingStudentSubjects)
  await existingStudentSubjects.map((item: any) => {
    if (!set.has(item.subjectId)) {
      return {
        ...item,
      }
    }
  })
  console.log('second', existingStudentSubjects)
  // await subjectIds.forEach((subjectId: string) => {
  //   existingStudentSubjects.forEach((esubject: any) => {
  //     if (esubject.subjectId !== subjectId) {
  //       StudentSubject.update(
  //         { studentId: id, subjectId },
  //         {
  //           where: {
  //             subjectId: esubject.subjectId,
  //             studentId: id,
  //           },
  //         }
  //       )
  //     } else {
  //       StudentSubject.findOrCreate({
  //         where: { studentId: id },
  //         defaults: {
  //           subjectId,
  //           studentId: id,
  //         },
  //       })
  //     }
  //   })
  // })
  res.status(200).json({ response })
}
