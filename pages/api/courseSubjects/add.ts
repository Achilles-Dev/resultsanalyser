import type { NextApiRequest, NextApiResponse } from 'next'
import { CourseSubject } from '@/libs/models'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const data = req.body
  const response = await CourseSubject.create(data)
  res.status(200).json({ response })
}
