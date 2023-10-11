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

export const getServerSideProps: GetServerSideProps = async () => {
  const students = JSON.stringify(
    await Student.findAll({
      order: [['indexNo', 'ASC']],
      include: { model: Subject },
    })
  )
  return {
    props: {
      students: JSON.parse(students),
    },
  }
}

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
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [year, setYear] = useState<string>('')
  const [open, setOpen] = useState<boolean>(false)
  const [editOpen, setEditOpen] = useState<boolean>(false)
  const [editStatus, setEditStatus] = useState<string>('idle')
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [student, setStudent] = useState<any>({})
  const [subjects, setSubjects] = useState<any>([])
  const router = useRouter()

  const handleEdit = async (id: string) => {
    router.push({
      pathname: router.pathname,
      query: { id },
    })
    // setStudentId(id)
    setEditStatus('loading')
    setEditOpen(true)
    setEditStatus('success')
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
        .map((subject: any) => (
          <div
            key={subject.id}
            className='flex flex-col justify-center gap-2 py-2 border-r-3 w-[120px]'
          >
            <p className='flex border-b-2 px-2'>{subject.name}</p>
            <p className=' px-2'>{subject.Grade.grade}</p>
          </div>
        ))}
    </div>
  )

  const handleNameButtonClick = async (id: string) => {
    setSubjects([])
    setIsLoading(true)
    const { response } = await fetchStudent(id)
    setStudent(response)
    const stud = response
    stud.Subjects.map
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
    await subjects.forEach((subject: any, index: number) => {
      if (subject.type === 'core') {
        let name = `core${index + 1}` as keyof typeof data
        addStudentGrades({
          studentId: student.id,
          subjectId: subject.id,
          grade: data[`${name}`],
        })
      } else {
        let name = `elective${index + 1}` as keyof typeof data
        addStudentGrades({
          studentId: student.id,
          subjectId: subject.id,
          grade: data[`${name}`],
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

  return (
    <main className='px-2 pt-2'>
      <Card className='min-h-[89vh] px-2'>
        <CardHeader className='border-b-1 py-2'>
          <p className='uppercase text-center w-full md:text-[36px] font-bold'>
            Student Results {year ? `(${year}/${year + 1})` : ''}
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
        // saveStatus={saveUpdateStatus}
      />
    </main>
  )
}

export default Results
