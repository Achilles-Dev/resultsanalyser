import type { NextApiRequest, NextApiResponse } from 'next'
import studentData from '@/data.json'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const response = studentData.students
  res.status(200).json({ response })
}
