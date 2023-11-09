import { useEffect, useState } from 'react'
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
import { createCourse, fetchCourse, updateCourse } from '@/libs/api'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { Course, Student, Subject } from '@/libs/models'
import { v4 as uuidv4 } from 'uuid'
import { useRouter } from 'next/router'
import EditModal from '@/components/EditModal'
import { getCookie } from 'cookies-next'

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const yearGroup = getCookie('year', { req, res }) as string
  if (yearGroup) {
    const courses = JSON.stringify(
      await Course.findAll({
        order: [['createdAt', 'DESC']],
        include: [
          { model: Subject },
          { model: Student, where: { yearGroup: yearGroup } },
        ],
      })
    )

    const subjects = JSON.stringify(
      await Subject.findAll({
        where: {
          type: 'elective',
        },
      })
    )

    return {
      props: {
        courses: JSON.parse(courses),
        subjects: JSON.parse(subjects),
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

interface coursesProps {
  code: number
  name: string
  electiveSubjects?: string
}

const Courses = ({
  courses,
  subjects,
  yearGroup,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [open, setOpen] = useState<boolean>(false)
  const [editOpen, setEditOpen] = useState<boolean>(false)
  const [course, setCourse] = useState<any>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isFetched, setIsFetched] = useState<boolean>(false)
  const [saveUpdateStatus, setSaveUpdateStatus] = useState<string>('idle')
  const router = useRouter()

  const handleEdit = async (id: string) => {
    router.push({
      pathname: router.pathname,
      query: { id },
    })
    setIsLoading(true)
    const { response } = await fetchCourse(id)
    setCourse(response)
    const myCourse = response
    setValue('code', myCourse.code)
    setValue('name', myCourse.name)
    setValue(
      'electiveSubjects',
      myCourse.Subjects.map((val: any) => val.id).join(',')
    )
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
      {mySubjects.map((subject: any) => (
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
      const myCourses = courses.map((course: any) => ({
        ...course,
        subjects: electiveSubjects(course.Subjects),
        number: course.Students.length,
        edit: editDelete(course.id),
      }))
      setIsLoading(false)
      return {
        items: myCourses.sort((a: any, b: any) => a.code - b.code),
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

  const createCourseSchema = yup.object().shape({
    code: yup.number().required('Course code is required'),
    name: yup.string().required('Name of course is required'),
    electiveSubjects: yup.string(),
  })

  const { register, setValue, handleSubmit, reset, control, formState } =
    useForm({
      reValidateMode: 'onBlur',
      resolver: yupResolver(createCourseSchema),
    })

  const { errors } = formState

  const handleCreateCourse = async (data: coursesProps) => {
    const id = uuidv4()
    setSaveUpdateStatus('loading')
    const subjectIds = data.electiveSubjects
      ? data.electiveSubjects.split(',')
      : []
    await createCourse({
      id,
      code: data.code,
      name: data.name,
      subjectIds,
    })
    const { response } = await fetchCourse(id)
    const newCourse = {
      ...response,
      subjects: electiveSubjects(response.Subjects),
      number: response.Students.length,
      edit: editDelete(response.id),
    }
    list.items.push(newCourse)

    setOpen(false)
    setSaveUpdateStatus('idle')
    reset()
  }

  const handleEditCourse = async (data: coursesProps) => {
    const subjectIds = data.electiveSubjects
      ? data.electiveSubjects.split(',')
      : []
    setSaveUpdateStatus('loading')
    await updateCourse({
      id: course.id,
      code: data.code,
      name: data.name,
      subjectIds,
    })
    const { response } = await fetchCourse(course.id)
    const editedCourse = {
      ...response,
      subjects: electiveSubjects(response.Subjects),
      number: response.Students.length,
      edit: editDelete(response.id),
    }
    list.update(course.id, editedCourse)

    setEditOpen(false)
    setSaveUpdateStatus('idle')
    reset()
  }

  useEffect(() => {
    if (!editOpen && router.query?.id) {
      router.push({
        pathname: router.pathname,
      })
      setValue('code', 100)
      setValue('name', '')
      setValue('electiveSubjects', '')
    }
  }, [editOpen, router.query?.id])

  return (
    <main className='px-2 pt-2'>
      <Card className='min-h-[89vh] px-2'>
        <CardHeader className='border-b-1 py-2'>
          <p className='uppercase text-center w-full md:text-[36px] font-bold'>
            Courses {yearGroup ? `(${yearGroup}/${Number(yearGroup) + 1})` : ''}
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
                Add Course
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
                placeholder='Search for a Course (Course Name)'
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
              <TableColumn key='code' allowsSorting>
                Code
              </TableColumn>
              <TableColumn key='name' allowsSorting>
                Course
              </TableColumn>
              <TableColumn key='number' allowsSorting>
                No. of Students
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
                <TableRow key={item.name}>
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
        handleCreate={handleCreateCourse}
        register={register}
        handleSubmit={handleSubmit}
        errors={errors}
        headerName='Create Course'
        name='Courses'
        buttonName='Submit'
        subjects={subjects}
        courses={courses}
        saveStatus={saveUpdateStatus}
      />
      {isFetched && (
        <EditModal
          open={editOpen}
          setOpen={setEditOpen}
          handleEdit={handleEditCourse}
          register={register}
          handleSubmit={handleSubmit}
          errors={errors}
          headerName='Update Course'
          name='Courses'
          buttonName='Update Course'
          control={control}
          courses={courses}
          subjects={subjects}
          updateStatus={saveUpdateStatus}
        />
      )}
    </main>
  )
}

export default Courses
