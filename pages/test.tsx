import { useEffect } from 'react'
const courseSubjects = [
  {
    courseId: '7171767d-4c15-4518-b624-49bd10a23d63',
    subjectId: '04806bec-d79d-4a5f-b993-34c257c915a9',
    createdAt: '2023-10-04T12:44:52.440Z',
    updatedAt: '2023-10-04T12:44:52.440Z',
  },
  {
    courseId: '7171767d-4c15-4518-b624-49bd10a23d63',
    subjectId: '5bfc19a5-20e5-433b-90b3-7aaed2d12984',
    createdAt: '2023-10-04T12:44:52.440Z',
    updatedAt: '2023-10-04T12:44:52.440Z',
  },
  {
    courseId: '7171767d-4c15-4518-b624-49bd10a23d63',
    subjectId: '50894d4e-5b10-4cb1-915b-ac9a5423851f',
    createdAt: '2023-10-04T12:44:52.441Z',
    updatedAt: '2023-10-04T12:44:52.441Z',
  },
  {
    courseId: '7171767d-4c15-4518-b624-49bd10a23d63',
    subjectId: 'ee4ace9d-ed71-4aa3-84bd-ad6e2c631e6c',
    createdAt: '2023-10-04T12:44:52.441Z',
    updatedAt: '2023-10-04T12:44:52.441Z',
  },
]

const subjectIds1 = [
  '04806bec-d79d-4a5f-b993-34c257c915a9',
  '5bfc19a5-20e5-433b-90b3-7aaed2d12984',
  '50894d4e-5b10-4cb1-915b-ac9a5423851f',
  'c3880fcc-38f8-4a21-8e12-25a8e30ee3b7',
  'd57ef398-f719-4b6b-8e73-8ce1df29199f',
]

const Test = () => {
  useEffect(() => {
    courseSubjects.forEach((item) => {
      if (!subjectIds1.includes(item.subjectId)) {
        console.log('Delete')
      } else {
        console.log('Retain')
      }
    })
  }, [])
  return (
    <div>
      <h1>Test</h1>
    </div>
  )
}

export default Test
