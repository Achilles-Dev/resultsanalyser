import { useEffect, useState } from 'react'
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  getKeyValue,
} from '@nextui-org/react'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { FaPlus } from 'react-icons/fa'
import { useAsyncList } from '@react-stately/data'
import CreateModal from '@/components/CreateModal'
import {
  createStudent,
  fetchCourses,
  fetchStudent,
  fetchStudents,
  updateStudent,
} from '@/libs/api'
import { useRouter } from 'next/router'
import EditModal from '@/components/EditModal'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { Course, Student, Subject } from '@/libs/models'
import { v4 as uuidv4 } from 'uuid'

export const getServerSideProps: GetServerSideProps = async () => {
  const students = JSON.stringify(
    await Student.findAll({
      order: [['createdAt', 'ASC']],
      include: [{ model: Subject }, { model: Course }],
    })
  )

  const courses = JSON.stringify(
    await Course.findAll({
      order: [['createdAt', 'DESC']],
      include: { model: Subject },
    })
  )

  return {
    props: {
      students: JSON.parse(students),
      allCourses: JSON.parse(courses),
    },
  }
}

interface studentsProps {
  year: string
  indexNo: string
  firstname: string
  lastname: string
  othername: string
  sex: string
  course: string
  subjects: string
}

const Students = ({
  students,
  allCourses,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [year, setYear] = useState<string>('')
  const [open, setOpen] = useState<boolean>(false)
  const [editOpen, setEditOpen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [student, setStudent] = useState<any>()
  const [courses, setCourses] = useState<any>(allCourses)
  const [subjects, setSubjects] = useState<any[]>([])
  const [selectedCourse, setSelectedCourse] = useState<string>('')
  const [isFetched, setIsFetched] = useState<boolean>(false)
  const router = useRouter()

  const handleEdit = async (id: string) => {
    router.push({
      pathname: router.pathname,
      query: { id },
    })
    const { response } = await fetchStudent(id)
    setStudent(response)
    const stud = response
    setValue('year', stud.yearGroup)
    setValue('indexNo', stud.indexNo)
    setValue('firstname', stud.firstName)
    setValue('lastname', stud.lastName)
    setValue('othername', stud?.otherName)
    setValue('sex', stud.sex.charAt(0).toUpperCase() + stud.sex.slice(1))
    setValue('course', stud.Course.id)
    setValue('subjects', stud.Subjects.map((val: any) => val.id).join(','))
    setIsFetched(true)

    setEditOpen(true)
  }

  const editDelete = (id: string) => (
    <div>
      <Button onPress={() => handleEdit(id)} color='primary'>
        Edit
      </Button>
    </div>
  )

  let list = useAsyncList({
    async load({ signal }) {
      setIsLoading(false)
      const myStudents = students.map((student: any) => ({
        ...student,
        name: `${student.lastName} ${student.firstName} ${
          student.otherName !== undefined ? student.otherName : ''
        }`,
        sex: student.sex.charAt(0).toUpperCase() + student.sex.slice(1),
        year: student.yearGroup,
        course: student.Course.name,
        subjects: student.Subjects.map((subject: any) => subject.name).join(
          ', '
        ),
        edit: editDelete(student.id),
      }))

      return {
        items: myStudents,
      }
    },
    async sort({
      items,
      sortDescriptor,
    }: {
      items: any[]
      sortDescriptor: any
    }) {
      return {
        items: items.sort((a: any[], b: any[]) => {
          let first = a[sortDescriptor.column]
          let second = b[sortDescriptor.column]
          let cmp =
            (parseInt(first) || first) < (parseInt(second) || second) ? -1 : 1

          if (sortDescriptor.direction === 'descending') {
            cmp *= -1
          }

          return cmp
        }),
      }
    },
  })

  const studentSchema = yup.object().shape({
    year: yup.string().required('Select student year of completion'),
    indexNo: yup.string().required('Index Number is required'),
    firstname: yup.string().required('First Name is required'),
    lastname: yup.string().required('Last Name is required'),
    othername: yup.string(),
    sex: yup.string().required('Sex is required'),
    course: yup.string().required('Select student course'),
    subjects: yup.string().required('Select student elective subjects'),
  })

  const { register, setValue, handleSubmit, reset, control, formState } =
    useForm({
      reValidateMode: 'onBlur',
      resolver: yupResolver(studentSchema),
    })

  const { errors } = formState

  const handleCreateStudent = async (data: studentsProps) => {
    const id = uuidv4()
    const subjectIds = data.subjects ? data.subjects.split(',') : []
    await createStudent({
      id,
      yearGroup: data.year,
      indexNo: data.indexNo,
      firstName: data.firstname,
      lastName: data.lastname,
      otherName: data.othername,
      sex: data.sex,
      courseId: data.course,
      subjectIds,
    })
    const { response } = await fetchStudent(id)
    const newStudent = {
      ...response,
      name: `${response.lastName} ${response.firstName} ${
        response.otherName !== undefined ? response.otherName : ''
      }`,
      sex: response.sex.charAt(0).toUpperCase() + response.sex.slice(1),
      year: response.yearGroup,
      course: response.Course.name,
      subjects: response.Subjects.map((subject: any) => subject.name).join(
        ', '
      ),
      edit: editDelete(response.id),
    }
    list.items.push(newStudent)
    setOpen(false)
    reset()
  }

  const handleEditStudent = async (data: studentsProps) => {
    const subjectIds = data.subjects ? data.subjects.split(',') : []
    await updateStudent({
      id: student.id,
      yearGroup: data.year,
      indexNo: data.indexNo,
      firstName: data.firstname,
      lastName: data.lastname,
      otherName: data.othername,
      sex: data.sex,
      courseId: data.course,
      subjectIds,
    })
    const { response } = await fetchStudent(student.id)
    const editedStudent = {
      ...response,
      name: `${response.lastName} ${response.firstName} ${
        response.otherName !== undefined ? response.otherName : ''
      }`,
      year: response.yearGroup,
      course: response.Course.name,
      subjects: response.Subjects.map((subject: any) => subject.name).join(
        ', '
      ),
      edit: editDelete(response.id),
    }
    list.update(student.id, editedStudent)

    setEditOpen(false)
    reset()
  }

  // useEffect(() => {
  //   fetchCourses().then((res) => {
  //     setCourses(res.response)
  //   })
  // }, [courses])

  useEffect(() => {
    if (selectedCourse) {
      const course = courses.find((course: any) => course.id === selectedCourse)
      setSubjects(course.Subjects)
    }
  }, [selectedCourse])

  useEffect(() => {
    if (!editOpen && router.query?.id) {
      router.push({
        pathname: router.pathname,
      })
      setValue('year', '')
      setValue('indexNo', '')
      setValue('firstname', '')
      setValue('lastname', '')
      setValue('othername', '')
      setValue('sex', '')
      setValue('course', '')
      setValue('subjects', '')
    }
  }, [editOpen, router.query?.id])

  return (
    <main className='px-2 pt-2'>
      <Card className='min-h-[89vh] px-2'>
        <CardHeader className='border-b-1 py-2'>
          <p className='uppercase text-center w-full md:text-[36px] font-bold'>
            Students {year ? `(${year}/${year + 1})` : ''}
          </p>
        </CardHeader>
        <CardBody className='py-5 px-1 md:px-3 flex flex-col gap-4'>
          <div className='flex flex-col md:flex-row md:justify-between gap-2 justify-end'>
            <div className='flex justify-end'>
              <Button
                color='primary'
                onPress={(e) => setOpen(true)}
                startContent={<FaPlus />}
              >
                Add Student
              </Button>
            </div>
            <form className='flex'>
              <Input
                classNames={{
                  inputWrapper: [
                    'rounded-r-none',
                    'bg-inherit',
                    'border border-primary',
                    'md:min-w-[300px]',
                  ],
                }}
                placeholder='Search for a student (Name | Index No.)'
              />
              <Button type='submit' color='primary' className='rounded-l-none'>
                Search
              </Button>
            </form>
          </div>
          <Table
            aria-label='Example table with client side sorting'
            sortDescriptor={list.sortDescriptor}
            onSortChange={list.sort}
            classNames={{
              table: 'min-h-[400px]',
            }}
          >
            <TableHeader>
              <TableColumn key='indexNo' allowsSorting>
                Index No.
              </TableColumn>
              <TableColumn key='name' allowsSorting>
                Student Name
              </TableColumn>
              <TableColumn key='sex' allowsSorting>
                Sex
              </TableColumn>
              <TableColumn key='course' allowsSorting>
                Course
              </TableColumn>
              <TableColumn key='subjects' allowsSorting>
                Elective Subjects
              </TableColumn>
              <TableColumn key='edit'>Edit / Delete</TableColumn>
            </TableHeader>
            <TableBody
              items={list.items}
              isLoading={isLoading}
              loadingContent={<Spinner label='Loading...' />}
            >
              {(item: any) => (
                <TableRow key={item.id}>
                  {(columnKey) => (
                    <TableCell>{getKeyValue(item, columnKey)}</TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
      <CreateModal
        open={open}
        setOpen={setOpen}
        handleCreate={handleCreateStudent}
        register={register}
        handleSubmit={handleSubmit}
        errors={errors}
        headerName='Register Students'
        name='Students'
        buttonName='Save Student'
        subjects={subjects}
        courses={courses}
        control={control}
        setSelectedCourse={setSelectedCourse}
      />
      {isFetched && (
        <EditModal
          open={editOpen}
          setOpen={setEditOpen}
          handleEdit={handleEditStudent}
          register={register}
          handleSubmit={handleSubmit}
          errors={errors}
          headerName='Update Student'
          name='Students'
          buttonName='Update Student'
          control={control}
          courses={courses}
          subjects={subjects}
          setSelectedCourse={setSelectedCourse}
        />
      )}
    </main>
  )
}

export default Students
