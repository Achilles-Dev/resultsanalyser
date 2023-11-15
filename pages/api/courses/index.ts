import type { NextApiRequest, NextApiResponse } from 'next'
import data from '@/data.json'
import { Course, Subject } from '@/libs/models'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const response = await Course.findAll({
    include: { model: Subject },
  })
  res.status(200).json({ response })
}
