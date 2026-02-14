import type { NextApiRequest, NextApiResponse } from 'next'
import { Student, Grade, Subject } from '@/libs/models'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    id,
    yearGroup,
    subjectIds,
  } = req.body
  const response = await Student.destroy({
      where: {
        id,
        yearGroup
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

  let coreSubjects1 = new Set()

  for (let item of existingStudentSubjects) {
    const subject = JSON.parse(
      JSON.stringify(await Subject.findByPk(item.subjectId))
    )
    if (subject.type === 'core') {
      if (!coreSubjects1.has(subject.id)) {
        coreSubjects1.add(subject.id)
        subjectIds.splice(subjectIds.indexOf(item.subjectId), 1)
      } else {
        await Grade.destroy({
          where: { id: item.id },
        })
      }
    }
    if (subject.type === 'elective') {
      if (!subjectIds.includes(item.subjectId)) {
        await Grade.destroy({
          where: { id: item.id },
        })
      } else {
        subjectIds.splice(subjectIds.indexOf(item.subjectId), 1)
      }
    }
  }

  await subjectIds.forEach((subjectId: string) => {
    Grade.destroy({
      where: [{ studentId: id, subjectId }],
    })
  })

  res.status(201).json({ response })
}