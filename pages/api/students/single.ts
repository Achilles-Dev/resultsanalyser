import type { NextApiRequest, NextApiResponse } from 'next'
import studentData from '@/data.json'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  const studentId = Number(id) - 1
  const response = studentData.students[studentId]
  res.status(200).json({ response })
}
