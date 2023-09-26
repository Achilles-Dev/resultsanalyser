import { useState } from 'react'
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
import { fetchStudents } from '@/components/api'
import EditModal from '@/components/EditModat'
import { useRouter } from 'next/router'

interface createStudentSProps {
  year: string
  indexNo: string
  firstname: string
  lastname: string
  othername: string
  sex: string
  course: string
  subjects: string
}

const Students = () => {
  const [year, setYear] = useState<string>('')
  const [open, setOpen] = useState<boolean>(false)
  const [editOpen, setEditOpen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const router = useRouter()

  const handleEdit = (id: number) => {
    router.push({
      pathname: router.pathname,
      query: { id },
    })
    setEditOpen(true)
  }

  const editDelete = (id: number) => (
    <div>
      <Button onPress={() => handleEdit(id)} color='primary'>
        Edit
      </Button>
    </div>
  )

  let list = useAsyncList({
    async load() {
      const { response } = await fetchStudents()
      setIsLoading(false)
      const students = response.map((student: any) => ({
        ...student,
        name: `${student.lastname} ${student.firstname} ${student?.othername}`,
        year: student.year.toString(),
        subjects: student.subjects.join(', '),
        edit: editDelete(student.id),
      }))
      return {
        items: students,
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

  const createStudentSchema = yup.object().shape({
    year: yup.string().required('Select student year of completion'),
    indexNo: yup.string().required('Index Number is required'),
    firstname: yup.string().required('First Name is required'),
    lastname: yup.string().required('Last Name is required'),
    othername: yup.string(),
    sex: yup.string().required('Sex is required'),
    course: yup.string().required('Select student course'),
    subjects: yup
      .string()
      .required('Select student core and elective subjects'),
  })

  const { register, handleSubmit, reset, formState } = useForm({
    reValidateMode: 'onBlur',
    resolver: yupResolver(createStudentSchema),
  })

  const { errors } = formState

  const handleCreateStudent = (data: createStudentSProps) => {
    console.log(data)
    setOpen(false)
    reset()
  }

  const handleEditStudent = (data: createStudentSProps) => {
    console.log(data)
    setEditOpen(false)
    reset()
  }

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
      />
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
      />
    </main>
  )
}

export default Students
