import { Subject } from '@/libs/models'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const response = await Subject.findAll()
  res.status(200).json({ response })
}
