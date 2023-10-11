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
import { AsyncListData, useAsyncList } from '@react-stately/data'
import { FaPlus } from 'react-icons/fa'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useState } from 'react'
import { Student, Subject } from '@/libs/models'
import { useRouter } from 'next/router'

export const getServerSideProps: GetServerSideProps = async () => {
  const students = JSON.stringify(
    await Student.findAll({
      order: [['createdAt', 'ASC']],
      include: { model: Subject },
    })
  )
  return {
    props: { students: JSON.parse(students) },
  }
}

const Results = ({
  students,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [year, setYear] = useState<string>('')
  const [open, setOpen] = useState<boolean>(false)
  const [editOpen, setEditOpen] = useState<boolean>(false)
  const [editStatus, setEditStatus] = useState<string>('idle')
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const router = useRouter()

  const handleEdit = async (id: string) => {
    router.push({
      pathname: router.pathname,
      query: { id },
    })
    // setStudentId(id)
    setEditStatus('loading')
    // const { response } = await fetchStudent(id)
    // setStudent(response)
    // const stud = response
    // setValue('year', stud.yearGroup)
    // setValue('indexNo', stud.indexNo)
    // setValue('firstname', stud.firstName)
    // setValue('lastname', stud.lastName)
    // setValue('othername', stud?.otherName)
    // setValue('sex', stud.sex.charAt(0).toUpperCase() + stud.sex.slice(1))
    // setValue('course', stud.Course.id)
    // setValue('subjects', stud.Subjects.map((val: any) => val.id).join(','))
    // setIsFetched(true)
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

  let list: AsyncListData<any> = useAsyncList({
    async load({ signal }) {
      const myStudents = students.map((student: any) => ({
        ...student,
        name: `${student.lastName} ${student.firstName} ${
          student.otherName !== undefined ? student.otherName : ''
        }`,
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
    </main>
  )
}

export default Results
