import React, { useEffect, useMemo, useState } from 'react'
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
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
import { AsyncListData, useAsyncList } from '@react-stately/data'
import CreateModal from '@/components/CreateModal'
import { createStudent, fetchStudent, updateStudent } from '@/libs/api'
import { useRouter } from 'next/router'
import EditModal from '@/components/EditModal'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { Course, Student, Subject } from '@/libs/models'
import { v4 as uuidv4 } from 'uuid'
import { getCookie } from 'cookies-next'

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const yearGroup = getCookie('year', { req, res }) as string
  if (yearGroup) {
    const students = JSON.stringify(
      await Student.findAll({
        where: {
          yearGroup: yearGroup,
        },
        order: [['indexNo', 'ASC']],
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
        courses: JSON.parse(courses),
        yearGroup,
      },
    }
  } else {
    return {
      redirect: {
        permanent: false,
        destination: '/dashboard',
      },
      props: {},
    }
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
  courses,
  yearGroup,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [open, setOpen] = useState<boolean>(false)
  const [editOpen, setEditOpen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [student, setStudent] = useState<any>()
  const [subjects, setSubjects] = useState<any[]>([])
  const [selectedCourse, setSelectedCourse] = useState<string>('')
  const [isFetched, setIsFetched] = useState<boolean>(false)
  const [saveUpdateStatus, setSaveUpdateStatus] = useState<string>('idle')
  const [initialCourse, setInitialCourse] = useState()
  const [filterValue, setFilterValue] = useState('')
  const router = useRouter()

  const handleEdit = async (id: string) => {
    router.push({
      pathname: router.pathname,
      query: { id },
    })
    setIsLoading(true)
    const { response } = await fetchStudent(id)
    setStudent(response)
    const stud = response
    setInitialCourse(stud.Course.id)
    setValue('year', stud.yearGroup)
    setValue('indexNo', stud.indexNo)
    setValue('firstname', stud.firstName)
    setValue('lastname', stud.lastName)
    setValue('othername', stud?.otherName)
    setValue('sex', stud.sex)
    setValue('course', stud.Course.id)
    setValue('subjects', stud.Subjects.map((val: any) => val.id).join(','))
    setIsFetched(true)
    setEditOpen(true)
    setIsLoading(false)
  }

  const editDelete = (id: string) => (
    <div>
      <Button onPress={() => handleEdit(id)} color='primary' isLoading={false}>
        Edit
      </Button>
    </div>
  )

  const electiveSubjects = (mySubjects: []) => (
    <div className='flex flex-wrap gap-2 py-2'>
      {mySubjects
        .filter((subject: any) => subject.type === 'elective')
        .map((subject: any) => (
          <Chip
            classNames={{ content: 'object-scale-down' }}
            variant='dot'
            key={subject.id}
          >
            {subject.name}
          </Chip>
        ))}
    </div>
  )

  let list: AsyncListData<any> = useAsyncList({
    async load({ signal }) {
      const myStudents = students.map((student: any) => ({
        ...student,
        name: `${student.lastName} ${student.firstName} ${
          student.otherName !== undefined ? student.otherName : ''
        }`,
        sex: student.sex.charAt(0).toUpperCase() + student.sex.slice(1),
        year: student.yearGroup,
        course: student.Course.name,
        subjects: electiveSubjects(student.Subjects),
        edit: editDelete(student.id),
      }))
      setIsLoading(false)
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

  const filteredItems = useMemo(() => {
    let filteredStudents = [...list.items]
    if (!isNaN(Number(filterValue))) {
      filteredStudents = filteredStudents.filter((student: any) =>
        student.indexNo.includes(Number(filterValue))
      )
    } else {
      filteredStudents = filteredStudents.filter(
        (student: any) =>
          student.name
            .toLocaleLowerCase()
            .includes(filterValue.toLocaleLowerCase()) ||
          student.name.startsWith(filterValue.toLocaleLowerCase())
      )
    }

    return filteredStudents
  }, [list.items, filterValue])

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

  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    reset,
    control,
    formState,
  } = useForm({
    reValidateMode: 'onBlur',
    resolver: yupResolver(studentSchema),
  })

  const { errors } = formState

  const handleCreateStudent = async (data: studentsProps) => {
    const id = uuidv4()
    setSaveUpdateStatus('loading')
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
      subjects: electiveSubjects(response.Subjects),
      edit: editDelete(response.id),
    }
    list.items.push(newStudent)
    setOpen(false)
    setSaveUpdateStatus('idle')
    reset()
  }

  const handleEditStudent = async (data: studentsProps) => {
    const subjectIds = data.subjects ? data.subjects.split(',') : []
    console.log(subjectIds)
    setSaveUpdateStatus('loading')
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
      subjects: electiveSubjects(response.Subjects),
      edit: editDelete(response.id),
    }
    list.update(student.id, editedStudent)
    setEditOpen(false)
    setSaveUpdateStatus('idle')
    reset()
  }

  useEffect(() => {
    if (selectedCourse) {
      const course = courses.find((course: any) => course.id === selectedCourse)
      setSubjects(course.Subjects)
    }
    if (initialCourse !== getValues('course')) {
      setValue('subjects', '')
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
            Students{' '}
            {yearGroup ? `(${yearGroup}/${Number(yearGroup) + 1})` : ''}
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
                    'bg-inherit',
                    'border border-primary',
                    'md:min-w-[500px]',
                  ],
                }}
                onChange={(e) => setFilterValue(e.target.value)}
                placeholder='Search for a student (Name | Index No.)'
              />
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
              items={filteredItems}
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
        saveStatus={saveUpdateStatus}
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
          updateStatus={saveUpdateStatus}
        />
      )}
    </main>
  )
}

export default Students
