import type { NextApiRequest, NextApiResponse } from 'next'
import { Grade, Student } from '@/libs/models'
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
    Grade.create({ id: uuidv4(), studentId: id, subjectId })
  })

  res.status(200).json({ response: student })
}
