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
import { createCourse, fetchCourse, fetchCourses } from '@/libs/api'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { Course, Subject } from '@/libs/models'
import { v4 as uuidv4 } from 'uuid'

export const getServerSideProps: GetServerSideProps = async () => {
  const courses = JSON.stringify(
    await Course.findAll({
      order: [['createdAt', 'DESC']],
      include: { model: Subject },
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
      allCourses: JSON.parse(courses),
      subjects: JSON.parse(subjects),
    },
  }
}

interface createCoursesProps {
  code: number
  name: string
  electiveSubjects?: string
}

const Courses = ({
  allCourses,
  subjects,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [year, setYear] = useState<string>('')
  const [open, setOpen] = useState<boolean>(false)
  const [courses, setCourses] = useState<any>(allCourses)
  const [isCourseAdded, setIsCourseAdded] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  let list = useAsyncList({
    async load({ signal }) {
      const myCourses = courses.map((course: any) => ({
        ...course,
        subjects: course.Subjects.map((subject: any) => subject.name).join(
          ', '
        ),
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

  const { register, handleSubmit, reset, formState } = useForm({
    reValidateMode: 'onBlur',
    resolver: yupResolver(createCourseSchema),
  })

  const { errors } = formState

  const handleCreateCourse = async (data: createCoursesProps) => {
    const id = uuidv4()
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
    const course = {
      ...response,
      subjects: response.Subjects.map((subject: any) => subject.name).join(
        ', '
      ),
    }
    list.items.push(course)

    setOpen(false)
    reset()
  }

  return (
    <main className='px-2 pt-2'>
      <Card className='min-h-[89vh] px-2'>
        <CardHeader className='border-b-1 py-2'>
          <p className='uppercase text-center w-full md:text-[36px] font-bold'>
            Courses {year ? `(${year}/${year + 1})` : ''}
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
                Number of Students
              </TableColumn>
              <TableColumn key='subjects' allowsSorting>
                Elective Subjects
              </TableColumn>
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
      />
    </main>
  )
}

export default Courses
