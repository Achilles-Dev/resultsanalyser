export const fetchStudents = async () => {
  const results = await fetch('/api/students')
  return results.json()
}

export const fetchStudent = async (id: number) => {
  const results = await fetch(`/api/students/single?id=${id}`)
  return results.json()
}
