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
          <p className='uppercase text-center w-full md:text-[36px] '>
            Wassce Results Analyser {year}
          </p>
        </CardHeader>
        <CardBody>
          <p className='text-[24px] pb-2 border-b-1'>
            This software helps the user to be able to :
          </p>
          <ul>
            <li>
              Determine the candidates whose total aggregate (Best Six) is less
              than or equal to 24.
            </li>
            <li>
              Determine the candidates whose total aggregate (Best Six) is less
              than or equal to 36.
            </li>
            <li>Determine the total number of male and female candidates.</li>
            <li>
              Determine the number of candidates who failed to appear for a
              paper.
            </li>
            <li>
              Determine the number of candidates whose results were cancelled.
            </li>
            <li>
              Determine the number of candidates whose results were withheld.
            </li>
            <li>
              Determine male & female candidates who had A1 - F9 in each subject
              written.
            </li>
            <li>
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
