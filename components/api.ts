export const fetchStudents = async () => {
  const results = await fetch('/api/students')
  return results.json()
}
