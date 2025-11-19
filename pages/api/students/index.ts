import type { NextApiRequest, NextApiResponse } from 'next'
// import studentData from '@/data.json'
import { Student } from '@/libs/models';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // const response = studentData.students
  const { yearGroup } = req.query
  const response = await Student.findAll({
    where: {
      yearGroup
    }
  })
  res.status(200).json({ response })
}
