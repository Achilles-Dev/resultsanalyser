import type { NextApiRequest, NextApiResponse } from 'next'
import { Student } from '@/libs/models'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const data = req.body
  const response = await Student.create(data)
  res.status(200).json({ response })
}
