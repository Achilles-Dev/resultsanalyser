import { Student, Subject } from '@/libs/models'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query
  const response = await Subject.findOne({
    where: {
      id: id,
    },
    include: [{ model: Student }],
  })
  res.status(200).json({ response })
}
