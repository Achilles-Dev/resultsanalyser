import type { NextApiRequest, NextApiResponse } from 'next'
import { User } from '@/libs/models'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const data = req.body
  const user = await User.findOne({
    where: {
      email: data.email,
    },
  })
  if (user) {
    res.status(400).json({message: "User already exists"})
  } else {
    const response = await User.create(data)
    res.status(200).json({ response })
  }
}
