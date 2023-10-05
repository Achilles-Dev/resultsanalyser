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
import { createSubject } from '@/libs/api'
import { Subject } from '@/libs/models'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'

export const getServerSideProps: GetServerSideProps = async () => {
  const subjects = JSON.stringify(await Subject.findAll())

  return {
    props: {
      subjects: JSON.parse(subjects),
    },
  }
}

interface createSubjectsProps {
  code: number
  type: string
  name: string
}

const Subjects = ({
  subjects,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [year, setYear] = useState<string>('')
  const [open, setOpen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  let list = useAsyncList({
    async load({ signal }) {
      setIsLoading(false)
      return {
        items: subjects.sort((a: any, b: any) => a.code - b.code),
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

  const createSubjectSchema = yup.object().shape({
    code: yup.number().required('Subject code is required'),
    type: yup.string().required('Select type of subject'),
    name: yup.string().required('Name of sunject is required'),
  })

  const { register, handleSubmit, reset, formState } = useForm({
    reValidateMode: 'onBlur',
    resolver: yupResolver(createSubjectSchema),
  })

  const { errors } = formState

  const handleCreateSubject = async (data: createSubjectsProps) => {
    await createSubject({ code: data.code, type: data.type, name: data.name })
    setOpen(false)
    reset()
  }

  return (
    <main className='px-2 pt-2'>
      <Card className='min-h-[89vh] px-2'>
        <CardHeader className='border-b-1 py-2'>
          <p className='uppercase text-center w-full md:text-[36px] font-bold'>
            Subjects {year ? `(${year}/${year + 1})` : ''}
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
                    'rounded-r-none',
                    'bg-inherit',
                    'border border-primary',
                    'md:min-w-[300px]',
                  ],
                }}
                placeholder='Search for a Subject (Subject Name)'
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
                Subject
              </TableColumn>
              <TableColumn key='number' allowsSorting>
                Number of Students
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
        handleCreate={handleCreateSubject}
        register={register}
        handleSubmit={handleSubmit}
        errors={errors}
        headerName='Create Subject'
        name='Subjects'
        buttonName='Add Subject'
      />
    </main>
  )
}

export default Subjects
