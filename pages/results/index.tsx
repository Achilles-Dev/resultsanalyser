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
import { AsyncListData, useAsyncList } from '@react-stately/data'
import * as yup from 'yup'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useEffect, useState } from 'react'
import { Student, Subject } from '@/libs/models'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { addStudentGrades, fetchStudent } from '@/libs/api'
import CreateModal from '@/components/CreateModal'
import EditModal from '@/components/EditModal'
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
        include: { model: Subject },
      })
    )
    return {
      props: {
        students: JSON.parse(students),
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

const grades = [
  { value: 'A1', name: 'A1' },
  { value: 'B2', name: 'B2' },
  { value: 'B3', name: 'B3' },
  { value: 'C4', name: 'C4' },
  { value: 'C5', name: 'C5' },
  { value: 'C6', name: 'C6' },
  { value: 'D7', name: 'D7' },
  { value: 'E8', name: 'E8' },
  { value: 'F9', name: 'F9' },
  { value: 'Withheld', name: 'Withheld' },
  { value: 'Canceled', name: 'Canceled' },
  { value: 'Absent', name: 'Absent' },
]

interface studentResultsProps {
  core1: string
  core2: string
  core3: string
  core4: string
  elective5: string
  elective6: string
  elective7: string
  elective8: string
}

const Results = ({
  students,
  yearGroup,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [open, setOpen] = useState<boolean>(false)
  const [editOpen, setEditOpen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [student, setStudent] = useState<any>({})
  const [subjects, setSubjects] = useState<any>([])
  const [isFetched, setIsFetched] = useState<boolean>(false)
  const [saveUpdateStatus, setSaveUpdateStatus] = useState<string>('idle')
  const router = useRouter()

  const handleEdit = async (id: string) => {
    router.push({
      pathname: router.pathname,
      query: { id },
    })
    setSubjects([])
    setIsLoading(true)
    const { response } = await fetchStudent(id)
    setStudent(response)
    const sortedSubjects = response.Subjects.sort((a: any, b: any) => {
      let first = a.type
      let second = b.type
      if (first < second) {
        return -1
      }
      if (first > second) {
        return 1
      }
      return 0
    })
    sortedSubjects.forEach((subject: any, index: number) => {
      if (subject.type === 'core') {
        let name = `core${index + 1}` as keyof studentResultsProps
        let value = sortedSubjects[index].Grade.grade
          ? sortedSubjects[index].Grade.grade
          : sortedSubjects[index].Grade.status
        setValue(name, value)
      } else {
        let name = `elective${index + 1}` as keyof studentResultsProps
        let value = sortedSubjects[index].Grade.grade
          ? sortedSubjects[index].Grade.grade
          : sortedSubjects[index].Grade.status
        setValue(name, value)
        console.log(value)
      }
    })
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

  const subjectWithResults = (subjects: any) => (
    <div className='flex'>
      {subjects
        .sort((a: any, b: any) => {
          let first = a.name
          let second = b.name
          if (first < second) {
            return -1
          }
          if (first > second) {
            return 1
          }
          return 0
        })
        .sort((a: any, b: any) => {
          let first = a.type
          let second = b.type
          if (first < second) {
            return -1
          }
          if (first > second) {
            return 1
          }
          return 0
        })
        .map((subject: any, index: number) => (
          <div
            key={subject.id}
            className={`flex flex-col justify-center gap-2 py-2 border-r-3 w-[150px] ${
              index === 0 ? 'border-l-3' : ''
            }`}
          >
            <p className='flex border-b-2 px-2 h-[40px]'>{subject.name}</p>
            <p className='h-[20px] px-2'>
              {subject.Grade.status
                ? subject.Grade.status
                : subject.Grade.grade}
            </p>
          </div>
        ))}
    </div>
  )

  const handleNameButtonClick = async (id: string) => {
    setSubjects([])
    setIsLoading(true)
    const { response } = await fetchStudent(id)
    setStudent(response)
    setIsLoading(false)
    setOpen(true)
  }

  const nameButton = (student: any) => (
    <Button
      className='p-0 bg-transparent data-[hover=true]:bg-transparent'
      variant='light'
      color='primary'
      onPress={() => handleNameButtonClick(student.id)}
    >
      {`${student.lastName} ${student.firstName} ${
        student.otherName !== undefined ? student.otherName : ''
      }`}
    </Button>
  )

  let list: AsyncListData<any> = useAsyncList({
    async load({ signal }) {
      const myStudents = students.map((student: any) => ({
        ...student,
        name: nameButton(student),
        subjects: subjectWithResults(student.Subjects),
        edit: editDelete(student.id),
      }))
      setIsLoading(false)
      return {
        items: myStudents.sort((a: any, b: any) => a.indexNo - b.indexNo),
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
    core1: yup.string().required('Grade is required'),
    core2: yup.string().required('Grade is required'),
    core3: yup.string().required('Grade is required'),
    core4: yup.string().required('Grade is required'),
    elective5: yup.string().required('Grade is required'),
    elective6: yup.string().required('Grade is required'),
    elective7: yup.string().required('Grade is required'),
    elective8: yup.string().required('Grade is required'),
  })

  const { register, setValue, handleSubmit, reset, control, formState } =
    useForm({
      reValidateMode: 'onBlur',
      resolver: yupResolver(studentSchema),
    })

  const { errors } = formState

  const handleCreateStudentResults = async (data: studentResultsProps) => {
    setSaveUpdateStatus('loading')
    await subjects.forEach((subject: any, index: number) => {
      if (subject.type === 'core') {
        let name = `core${index + 1}` as keyof typeof data
        let grade = data[`${name}`]
        let status = ''
        if (
          data[`${name}`] === 'Withheld' ||
          data[`${name}`] === 'Canceled' ||
          data[`${name}`] === 'Absent'
        ) {
          status = data[`${name}`]
          grade = ''
        }
        addStudentGrades({
          studentId: student.id,
          subjectId: subject.id,
          grade,
          status,
        })
      } else {
        let name = `elective${index + 1}` as keyof typeof data
        let grade = data[`${name}`]
        let status = ''
        if (
          data[`${name}`] === 'Withheld' ||
          data[`${name}`] === 'Canceled' ||
          data[`${name}`] === 'Absent'
        ) {
          status = data[`${name}`]
          grade = ''
        }
        addStudentGrades({
          studentId: student.id,
          subjectId: subject.id,
          grade,
          status,
        })
      }
    })
    const { response } = await fetchStudent(student.id)
    const editedStudent = {
      ...response,
      name: nameButton(response),
      subjects: subjectWithResults(response.Subjects),
      edit: editDelete(response.id),
    }
    list.update(student.id, editedStudent)
    setOpen(false)
    setSaveUpdateStatus('idle')
    reset()
  }

  const handleEditStudentResults = async (data: studentResultsProps) => {
    setSaveUpdateStatus('loading')
    await subjects.forEach((subject: any, index: number) => {
      if (subject.type === 'core') {
        let name = `core${index + 1}` as keyof typeof data
        let grade = data[`${name}`]
        let status = ''
        if (
          data[`${name}`] === 'Withheld' ||
          data[`${name}`] === 'Canceled' ||
          data[`${name}`] === 'Absent'
        ) {
          status = data[`${name}`]
          grade = ''
        }
        addStudentGrades({
          studentId: student.id,
          subjectId: subject.id,
          grade,
          status,
        })
      } else {
        let name = `elective${index + 1}` as keyof typeof data
        let grade = data[`${name}`]
        let status = ''
        if (
          data[`${name}`] === 'Withheld' ||
          data[`${name}`] === 'Canceled' ||
          data[`${name}`] === 'Absent'
        ) {
          status = data[`${name}`]
          grade = ''
        }
        addStudentGrades({
          studentId: student.id,
          subjectId: subject.id,
          grade,
          status,
        })
      }
    })
    const { response } = await fetchStudent(student.id)
    const editedStudent = {
      ...response,
      name: nameButton(response),
      subjects: subjectWithResults(response.Subjects),
      edit: editDelete(response.id),
    }
    list.update(student.id, editedStudent)
    setEditOpen(false)
    setSaveUpdateStatus('idle')
    reset()
  }

  useEffect(() => {
    if (Object.keys(student).length > 0 && subjects.length < 8) {
      const sortedSubjects = student.Subjects.sort((a: any, b: any) => {
        let first = a.type
        let second = b.type
        if (first < second) {
          return -1
        }
        if (first > second) {
          return 1
        }
        return 0
      })
      setSubjects([...subjects, ...sortedSubjects])
    }
  }, [student])

  useEffect(() => {
    if (!editOpen) {
      router.push({
        pathname: router.pathname,
      })
      setValue('core1', '')
      setValue('core2', '')
      setValue('core3', '')
      setValue('core4', '')
      setValue('elective5', '')
      setValue('elective6', '')
      setValue('elective7', '')
      setValue('elective8', '')
    }
  }, [editOpen])

  return (
    <main className='px-2 pt-2'>
      <Card className='min-h-[89vh] px-2'>
        <CardHeader className='border-b-1 py-2'>
          <p className='uppercase text-center w-full md:text-[36px] font-bold'>
            Student Results{' '}
            {yearGroup ? `(${yearGroup}/${Number(yearGroup) + 1})` : ''}
          </p>
        </CardHeader>
        <CardBody className='py-5 px-1 md:px-3 flex flex-col gap-4'>
          <div className='flex justify-end'>
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
              <TableColumn key='subjects' allowsSorting>
                Subjects with Results
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
        handleCreate={handleCreateStudentResults}
        register={register}
        handleSubmit={handleSubmit}
        errors={errors}
        headerName={`Add Results for ${student.lastName} ${student.firstName} ${
          student.otherName !== undefined ? student.otherName : ''
        }`}
        name='Grades'
        buttonName='Save'
        subjects={subjects}
        control={control}
        saveStatus={saveUpdateStatus}
        grades={grades}
      />
      {isFetched && (
        <EditModal
          open={editOpen}
          setOpen={setEditOpen}
          handleEdit={handleEditStudentResults}
          register={register}
          handleSubmit={handleSubmit}
          errors={errors}
          headerName={`Update Results for ${student.lastName} ${
            student.firstName
          } ${student.otherName !== undefined ? student.otherName : ''}`}
          name='Grades'
          buttonName='Update Results'
          control={control}
          subjects={subjects}
          updateStatus={saveUpdateStatus}
          grades={grades}
        />
      )}
    </main>
  )
}

export default Results
