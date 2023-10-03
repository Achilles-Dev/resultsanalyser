import type { NextApiRequest, NextApiResponse } from 'next'
import { StudentSubject } from '@/libs/models'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const data = req.body
  const response = await StudentSubject.create(data)
  res.status(200).json({ response })
}
