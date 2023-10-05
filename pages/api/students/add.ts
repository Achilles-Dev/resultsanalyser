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
  const student = await Student.create({
    id,
    indexNo,
    yearGroup,
    firstName,
    lastName,
    otherName,
    sex,
    courseId,
  })
  await subjectIds.forEach((subjectId: string) => {
    StudentSubject.create({ studentId: id, subjectId })
  })

  res.status(200).json({ response: student })
}
