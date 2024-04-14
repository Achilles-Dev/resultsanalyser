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

  // const coreSubjects = await Subject.findAll({
  //   where: {
  //     type: 'core',
  //   },
  // })

  // for (let subject of coreSubjects) {
  //   await Grade.create({ id: uuidv4(), studentId: id, subjectId: subject.id })
  // }

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
    Grade.create({
      id: uuidv4(),
      subjectId,
      studentId: id,
    })
  })

  res.status(200).json({ response })
}
