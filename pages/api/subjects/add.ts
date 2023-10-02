import type { NextApiRequest, NextApiResponse } from 'next'
import data from '@/data.json'
import { Subject } from '@/libs/models'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const data = req.body
  const response = await Subject.create(data)
  res.status(200).json({ response })
}
