import type { NextApiRequest, NextApiResponse } from 'next'
// import studentData from '@/data.json'
import { Course, Student, Subject } from '@/libs/models';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // const response = studentData.students
  const { yearGroup, course, subject } = req.query
  let response
  if (course && subject) {
    response = await Student.findAll({
      where: {
        yearGroup
      },
      include: [{ model: Course }, { model: Subject }],
    })
  } else if (subject) {
    response = await Student.findAll({
      where: {
        yearGroup
      },
      include: { model: Subject },
    })
  } else if (course) {
    response = await Student.findAll({
      where: {
        yearGroup
      },
      include: { model: Course },
    })
  }
   else {
    response = await Student.findAll({
      where: {
        yearGroup
      }
    })
  }
  res.status(200).json({ response })
}