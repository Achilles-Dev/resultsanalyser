import type { NextApiRequest, NextApiResponse } from 'next'
import { Subject } from '@/libs/models'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id, code, type, name } = req.body
  const course = await Subject.update(
    { code, type, name },
    {
      where: {
        id,
      },
    }
  )

  res.status(200).json({ response: course })
}
