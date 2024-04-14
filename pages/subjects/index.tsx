import { useEffect, useMemo, useState } from 'react'
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
import { AsyncListData, useAsyncList } from '@react-stately/data'
import CreateModal from '@/components/CreateModal'
import { createSubject, fetchSubject, updateSubject } from '@/libs/api'
import { Student, Subject } from '@/libs/models'
import { v4 as uuidv4 } from 'uuid'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import EditModal from '@/components/EditModal'
import { getCookie } from 'cookies-next'

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const yearGroup = getCookie('year', { req, res }) as string
  if (yearGroup) {
    const subjects = JSON.stringify(
      await Subject.findAll({
        order: [['createdAt', 'DESC']],
        include: { model: Student, where: { yearGroup: yearGroup } },
      })
    )

    const students = JSON.stringify(
      await Student.findAll({
        where: {
          yearGroup: yearGroup,
        },
      })
    )

    return {
      props: {
        subjects: JSON.parse(subjects),
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

interface subjectsProps {
  code: number
  type: string
  name: string
}

const Subjects = ({
  subjects,
  students,
  yearGroup,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [open, setOpen] = useState<boolean>(false)
  const [editOpen, setEditOpen] = useState<boolean>(false)
  const [subject, setSubject] = useState<any>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isFetched, setIsFetched] = useState<boolean>(false)
  const [saveUpdateStatus, setSaveUpdateStatus] = useState<string>('idle')
  const [filterValue, setFilterValue] = useState('')
  const router = useRouter()

  const handleEdit = async (id: string) => {
    router.push({
      pathname: router.pathname,
      query: { id },
    })
    setIsLoading(true)
    const { response } = await fetchSubject(id)
    setSubject(response)
    const mySubject = response
    setValue('code', mySubject.code)
    setValue('name', mySubject.name)
    setValue('type', mySubject.type)
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

  let list: AsyncListData<any> = useAsyncList({
    async load({ signal }) {
      const myStubjects = subjects.map((subject: any) => ({
        ...subject,
        number:
          subject.type === 'core' ? students.length : subject.Students.length,
        edit: editDelete(subject.id),
      }))
      setIsLoading(false)
      return {
        items: myStubjects.sort((a: any, b: any) => a.code - b.code),
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
    let filteredSubjects = [...list.items]
    if (filterValue) {
      if (!isNaN(Number(filterValue))) {
        filteredSubjects = filteredSubjects.filter(
          (subject: any) => subject.code === Number(filterValue)
        )
      } else {
        filteredSubjects = filteredSubjects.filter(
          (subject: any) =>
            subject.name
              .toLocaleLowerCase()
              .includes(filterValue.toLocaleLowerCase()) ||
            subject.name.startsWith(filterValue.toLocaleLowerCase())
        )
      }
    }

    return filteredSubjects
  }, [list.items, filterValue])

  const createSubjectSchema = yup.object().shape({
    code: yup.number().required('Subject code is required'),
    type: yup.string().required('Select type of subject'),
    name: yup.string().required('Name of sunject is required'),
  })

  const { register, setValue, handleSubmit, reset, control, formState } =
    useForm({
      reValidateMode: 'onBlur',
      resolver: yupResolver(createSubjectSchema),
    })

  const { errors } = formState

  const handleCreateSubject = async (data: subjectsProps) => {
    const id = uuidv4()
    setSaveUpdateStatus('loading')
    await createSubject({
      id,
      code: data.code,
      type: data.type,
      name: data.name,
    })
    const { response } = await fetchSubject(id)
    const newSubject = {
      ...response,
      number:
        response.type === 'core' ? students.length : response.Students.length,
      edit: editDelete(response.id),
    }
    list.items.push(newSubject)
    list.items.sort((a: any, b: any) => a.code - b.code)
    setOpen(false)
    setSaveUpdateStatus('idle')
    reset()
  }

  const handleEditSubject = async (data: subjectsProps) => {
    setSaveUpdateStatus('loading')
    await updateSubject({
      id: subject.id,
      code: data.code,
      type: data.type,
      name: data.name,
    })
    const { response } = await fetchSubject(subject.id)
    const editedSubject = {
      ...response,
      number:
        response.type === 'core' ? students.length : response.Students.length,
      edit: editDelete(response.id),
    }
    list.update(subject.id, editedSubject)

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
      setValue('type', '')
    }
  }, [editOpen, router.query?.id])

  return (
    <main className='px-2 pt-2'>
      <Card className='min-h-[89vh] px-2'>
        <CardHeader className='border-b-1 py-2'>
          <p className='uppercase text-center w-full md:text-[36px] font-bold'>
            Subjects{' '}
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
                Add Subject
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
                placeholder='Search for a Subject (Subject Name || subject code)'
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
              <TableColumn key='code' allowsSorting>
                Code
              </TableColumn>
              <TableColumn key='name' allowsSorting>
                Subject
              </TableColumn>
              <TableColumn key='number' allowsSorting>
                No. of Students
              </TableColumn>
              <TableColumn key='edit'>Edit / Delete</TableColumn>
            </TableHeader>
            <TableBody
              items={filteredItems}
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
        handleCreate={handleCreateSubject}
        register={register}
        handleSubmit={handleSubmit}
        errors={errors}
        headerName='Create Subject'
        name='Subjects'
        buttonName='Add Subject'
        saveStatus={saveUpdateStatus}
      />
      {isFetched && (
        <EditModal
          open={editOpen}
          setOpen={setEditOpen}
          handleEdit={handleEditSubject}
          register={register}
          handleSubmit={handleSubmit}
          errors={errors}
          headerName='Update Subject'
          name='Subjects'
          buttonName='Update Subject'
          control={control}
          subjects={subjects}
          updateStatus={saveUpdateStatus}
        />
      )}
    </main>
  )
}

export default Subjects
