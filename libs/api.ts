import { hash } from 'bcrypt-ts'
import { v4 as uuidv4 } from 'uuid'

export const initDb = async () => {
  const response = await fetch('api/dbInit')
  return response.json()
}

export const fetchStudents = async () => {
  const results = await fetch('/api/students')
  return results.json()
}

export const fetchStudent = async (id: string) => {
  const results = await fetch(`/api/students/single?id=${id}`)
  return results.json()
}

export const fetchCourses = async () => {
  const results = await fetch('/api/courses')
  return results.json()
}

export const fetchCourse = async (id: string) => {
  const results = await fetch(`/api/courses/single?id=${id}`)
  return results.json()
}

export const fetchSubjects = async () => {
  const results = await fetch('/api/subjects')
  return results.json()
}

export const fetchSubject = async (id: string) => {
  const results = await fetch(`/api/subjects/single?id=${id}`)
  return results.json()
}

export const createStudent = async ({
  id,
  indexNo,
  yearGroup,
  firstName,
  lastName,
  otherName,
  sex,
  courseId,
  subjectIds,
}: {
  id: string
  indexNo: string
  yearGroup: string
  firstName: string
  lastName: string
  otherName?: string
  sex: string
  courseId: string
  subjectIds: readonly string[]
}) => {
  const data = {
    id,
    indexNo,
    yearGroup,
    firstName,
    lastName,
    otherName,
    sex,
    courseId,
    subjectIds,
  }
  const results = await fetch('/api/students/add', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(data),
  })
  return results.json()
}

export const updateStudent = async ({
  id,
  indexNo,
  yearGroup,
  firstName,
  lastName,
  otherName,
  sex,
  courseId,
  subjectIds,
}: {
  id: string
  indexNo: string
  yearGroup: string
  firstName: string
  lastName: string
  otherName?: string
  sex: string
  courseId: string
  subjectIds: readonly string[]
}) => {
  const data = {
    id,
    indexNo,
    yearGroup,
    firstName,
    lastName,
    otherName,
    sex,
    courseId,
    subjectIds,
  }
  const results = await fetch('/api/students/update', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(data),
  })
  return results.json()
}

export const createCourse = async ({
  id,
  code,
  name,
  subjectIds,
}: {
  id: string
  code: number
  name: string
  subjectIds: readonly string[]
}) => {
  const data = {
    id,
    code,
    name,
    subjectIds,
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

export const updateCourse = async ({
  id,
  code,
  name,
  subjectIds,
}: {
  id: string
  code: number
  name: string
  subjectIds: readonly string[]
}) => {
  const data = {
    id,
    code,
    name,
    subjectIds,
  }
  const results = await fetch('/api/courses/update', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(data),
  })
  return results.json()
}

export const createSubject = async ({
  id,
  code,
  type,
  name,
}: {
  id: string
  code: number
  type: string
  name: string
}) => {
  const data = {
    id,
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

export const updateSubject = async ({
  id,
  code,
  type,
  name,
}: {
  id: string
  code: number
  type: string
  name: string
}) => {
  const data = {
    id,
    code,
    type,
    name,
  }
  const results = await fetch('/api/subjects/update', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(data),
  })
  return results.json()
}

export const addStudentGrades = async ({
  studentId,
  subjectId,
  grade,
  status,
}: {
  studentId: string
  subjectId: string
  grade: string
  status: string
}) => {
  const data = {
    studentId,
    subjectId,
    grade,
    status,
  }
  const results = await fetch('/api/grades/add', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(data),
  })
  return results.json()
}

export const addUser = async ({
  email,
  password,
}: {
  email: string
  password: string
}) => {
  const hashPassword = await hash(password, 10)
  const data = {
    id: uuidv4(),
    email,
    password: hashPassword,
  }
  const results = await fetch('/api/users/add', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(data),
  })
  return results.json()
}
