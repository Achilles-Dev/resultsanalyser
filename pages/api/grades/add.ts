import { Grade } from '@/libs/models'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { studentId, subjectId, grade, status } = req.body
  const response = await Grade.update(
    {
      grade,
      status,
    },
    {
      where: {
        subjectId,
        studentId,
      },
    }
  )

  res.status(200).json({ response })
}
