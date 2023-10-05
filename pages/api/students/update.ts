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

  await existingStudentSubjects.forEach((item: any) => {
    if (!subjectIds.includes(item.subjectId)) {
      StudentSubject.destroy({ where: { subjectId: item.subjectId } })
    } else {
      subjectIds.splice(subjectIds.indexOf(item.subjectId), 1)
    }
  })

  await subjectIds.forEach((subjectId: string) => {
    StudentSubject.create({
      subjectId,
      studentId: id,
    })
  })

  res.status(200).json({ response })
}
