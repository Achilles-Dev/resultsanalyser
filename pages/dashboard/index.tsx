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
import { useEffect, useState } from 'react'

const currentYear = new Date().getFullYear()
const yearRange = Array.from(
  { length: 20 },
  (_, i) => currentYear + 2 + i * -1
).reverse()

const Dashboard = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [year, setYear] = useState<string>('')
  const [selectValue, setSelectValue] = useState<any>('')

  useEffect(() => {
    if (year === '') {
      onOpen()
    }
  }, [year])
  return (
    <main>
      <Card className='min-h-[90vh]'>
        <CardHeader>
          <p className='uppercase text-center w-full md:text-[36px] font-bold '>
            Wassce Results Analyser {year}
          </p>
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
                  selectedKeys={selectValue}
                  onSelectionChange={setSelectValue}
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
