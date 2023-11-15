import { NextApiRequest, NextApiResponse } from 'next'
import { compareSync } from 'bcrypt-ts'
import { User } from '@/libs/models'

const comparePassword = (password: string, hash: any) => {
  const result = compareSync(password, hash)
  return result
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email, password } = await req.body
  const user = await User.findOne({
    where: {
      email: email,
    },
  })

  let response
  if (user) {
    const status = comparePassword(password, user.password)
    if (status) {
      response = {
        id: user.id,
        email: user.email,
      }
    } else {
      response = 'Invalid password'
    }
  } else {
    response = null
  }
  res.status(200).json({ response })
}
