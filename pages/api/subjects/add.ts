import type { NextApiRequest, NextApiResponse } from 'next'
import { Student, Subject } from '@/libs/models'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const data = req.body
  const response = await Subject.create(data, { include: Student })
  console.log(response)
  res.status(200).json({ response })
}
