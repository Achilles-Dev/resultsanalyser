import { Course, Student, Subject } from '@/libs/models'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query
  const response = await Course.findOne({
    where: {
      id: id,
    },
    include: [{ model: Subject }, { model: Student }],
  })
  res.status(200).json({ response })
}
