import type { NextApiRequest, NextApiResponse } from 'next'
import { Course, CourseSubject } from '@/libs/models'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id, code, name, subjectIds } = req.body
  const course = await Course.create({ id, code, name })
  await subjectIds.forEach((subjectId: string) => {
    CourseSubject.create({ courseId: id, subjectId })
  })

  res.status(200).json({ response: course })
}
