import type { NextApiRequest, NextApiResponse } from 'next'
import { Student, Grade, Subject } from '@/libs/models'
import { v4 as uuidv4 } from 'uuid'

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
      await Grade.findAll({
        where: { studentId: id },
      })
    )
  )

  await existingStudentSubjects.forEach((item: any) => {
    const subject = JSON.parse(JSON.stringify(Subject.findByPk(item.subjectId)))
    if (subject.type === 'elective') {
      if (!subjectIds.includes(item.subjectId)) {
        Grade.destroy({ where: { subjectId: item.subjectId } })
      } else {
        subjectIds.splice(subjectIds.indexOf(item.subjectId), 1)
      }
    }
  })

  await subjectIds.forEach((subjectId: string) => {
    Grade.create({
      id: uuidv4(),
      subjectId,
      studentId: id,
    })
  })

  res.status(200).json({ response })
}
