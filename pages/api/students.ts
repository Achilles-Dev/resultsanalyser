import type { NextApiRequest, NextApiResponse } from 'next'
import { students } from '@/data.json'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const response = students
  res.status(200).json({ response })
}
