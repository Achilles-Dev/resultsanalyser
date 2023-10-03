import { v4 as uuidv4 } from 'uuid'

export const initDb = async () => {
  const response = await fetch('api/dbInit')
  return response.json()
}

export const fetchStudents = async () => {
  const results = await fetch('/api/students')
  return results.json()
}

export const fetchStudent = async (id: number) => {
  const results = await fetch(`/api/students/single?id=${id}`)
  return results.json()
}

export const fetchCourses = async () => {
  const results = await fetch('/api/courses')
  return results.json()
}

export const fetchSubjects = async () => {
  const results = await fetch('/api/subjects')
  return results.json()
}

export const createCourse = async ({
  id,
  code,
  name,
}: {
  id: string
  code: number
  name: string
}) => {
  const data = {
    id,
    code,
    name,
  }
  const results = await fetch('/api/courses/add', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(data),
  })
  return results.json()
}

export const createCourseSubjects = async ({
  courseId,
  subjectId,
}: {
  courseId: string
  subjectId: string
}) => {
  const data = {
    courseId,
    subjectId,
  }
  const results = await fetch('/api/courseSubjects/add', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(data),
  })
  return results.json()
}

export const createSubject = async ({
  code,
  type,
  name,
}: {
  code: number
  type: string
  name: string
}) => {
  const data = {
    id: uuidv4(),
    code,
    type,
    name,
  }
  const results = await fetch('/api/subjects/add', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(data),
  })
  return results.json()
}
