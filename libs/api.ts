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
