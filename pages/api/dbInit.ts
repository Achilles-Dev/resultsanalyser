import { NextApiRequest, NextApiResponse } from 'next'
import { initDB } from '@/libs/models'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // await sequelize.sync()
  const response = await initDB()
  res.status(200).json({ response: response })
}
