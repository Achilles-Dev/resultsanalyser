import type { NextApiRequest, NextApiResponse } from 'next'
import { Course, CourseSubject } from '@/libs/models'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id, code, name, subjectIds } = req.body
  const course = await Course.update(
    { code, name },
    {
      where: {
        id,
      },
    }
  )
  const existingCourseSubjects = JSON.parse(
    JSON.stringify(
      await CourseSubject.findAll({
        where: { courseId: id },
      })
    )
  )

  await existingCourseSubjects.forEach((item: any) => {
    if (!subjectIds.includes(item.subjectId)) {
      CourseSubject.destroy({ where: { subjectId: item.subjectId } })
    } else {
      subjectIds.splice(subjectIds.indexOf(item.subjectId), 1)
    }
  })

  await subjectIds.forEach((subjectId: string) => {
    CourseSubject.create({
      subjectId,
      courseId: id,
    })
  })

  res.status(200).json({ response: course })
}
