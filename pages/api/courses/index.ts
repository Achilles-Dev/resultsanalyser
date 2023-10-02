import type { NextApiRequest, NextApiResponse } from 'next'
import data from '@/data.json'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const response = data.courses
  res.status(200).json({ response })
}
