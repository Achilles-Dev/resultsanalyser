import type { NextApiRequest, NextApiResponse } from 'next'
import data from '@/data.json'
import { Course } from '@/libs/models'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const response = await Course.findAll()
  res.status(200).json({ response })
}
