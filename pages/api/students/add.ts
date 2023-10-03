import type { NextApiRequest, NextApiResponse } from 'next'
import { Student } from '@/libs/models'

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
  const response = await Student.create({
    id,
    indexNo,
    yearGroup,
    firstName,
    lastName,
    otherName,
    sex,
    courseId,
  })

  res.status(200).json({ response })
}
