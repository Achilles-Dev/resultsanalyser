import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  useDisclosure,
} from '@nextui-org/react'
import { ChangeEvent, useEffect, useState } from 'react'
import { getCookie, setCookie } from 'cookies-next'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'

const currentYear = new Date().getFullYear()
const yearRange = Array.from(
  { length: 20 },
  (_, i) => currentYear + 2 + i * -1
).reverse()

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const yearGroup = getCookie('year', { req, res }) as string
  if (yearGroup) {
    return {
      props: {
        yearGroup,
      },
    }
  } else {
    return {
      props: { yearGroup: '' },
    }
  }
}

const Dashboard = ({
  yearGroup,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [year, setYear] = useState<string>(yearGroup)
  const [selectValue, setSelectValue] = useState<string>('')

  const handleSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectValue(e.target.value)
  }

  useEffect(() => {
    if (year === '') {
      onOpen()
    } else {
      setCookie('year', year)
    }
  }, [year])
  return (
    <main>
      <Card className='min-h-[90vh]'>
        <CardHeader>
          <p className='uppercase text-center w-full md:text-[36px] font-bold '>
            Wassce Results Analyser {year}
          </p>
          {year && (
            <Button color='primary' onPress={() => onOpen()}>
              Change Year
            </Button>
          )}
        </CardHeader>
        <CardBody>
          <p className='text-[24px] pb-2 border-b-2 font-bold'>
            This software helps the user to be able to :
          </p>
          <ul className='flex flex-col gap-2 text-[20px] pb-2 border-b-2'>
            <li className='pb-2 hover:border-b-1'>
              Determine the candidates whose total aggregate (Best Six) is less
              than or equal to 24.
            </li>
            <li className='pb-2 hover:border-b-1'>
              Determine the candidates whose total aggregate (Best Six) is less
              than or equal to 36.
            </li>
            <li className='pb-2 hover:border-b-1'>
              Determine the total number of male and female candidates.
            </li>
            <li className='pb-2 hover:border-b-1'>
              Determine the number of candidates who failed to appear for a
              paper.
            </li>
            <li className='pb-2 hover:border-b-1'>
              Determine the number of candidates whose results were cancelled.
            </li>
            <li className='pb-2 hover:border-b-1'>
              Determine the number of candidates whose results were withheld.
            </li>
            <li className='pb-2 hover:border-b-1'>
              Determine male & female candidates who had A1 - F9 in each subject
              written.
            </li>
            <li className='pb-2 hover:border-b-1'>
              Determine the number of candidates who had passes in all subjects
              to passes in no subject.
            </li>
          </ul>
        </CardBody>
      </Card>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>
                Select School Year Before you Continue
              </ModalHeader>
              <ModalBody>
                <Select
                  label='Year completed'
                  selectedKeys={[selectValue]}
                  onChange={handleSelect}
                >
                  {yearRange.map((yearValue) => (
                    <SelectItem
                      key={yearValue.toString()}
                      value={yearValue.toString()}
                    >
                      {yearValue.toString()}
                    </SelectItem>
                  ))}
                </Select>
              </ModalBody>
              <ModalFooter>
                <Button
                  color='primary'
                  onPress={() => {
                    setYear(selectValue)
                    onClose()
                  }}
                >
                  Submit
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </main>
  )
}

export default Dashboard
