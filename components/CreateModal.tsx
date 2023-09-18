import {
  Button,
  Chip,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
  useDisclosure,
} from '@nextui-org/react'

const currentYear = new Date().getFullYear()
const yearRange = Array.from(
  { length: 20 },
  (_, i) => currentYear + 2 + i * -1
).reverse()

interface CreateModalProps {
  open: boolean
  setOpen: (value: boolean) => void
  handleCreate: (data: any) => void
  register: any
  handleSubmit: any
  errors: any
}

const CreateModal = (props: CreateModalProps) => {
  const { open, setOpen, handleCreate, handleSubmit, register, errors } = props
  const { onOpenChange } = useDisclosure()
  return (
    <Modal
      isOpen={open}
      onOpenChange={onOpenChange}
      className='md:min-w-[600px] overflow-y-auto max-h-[90vh]'
      hideCloseButton
    >
      <ModalContent>
        <>
          <ModalHeader className='flex flex-col gap-1 items-center text-[24px]'>
            Register Student
          </ModalHeader>
          <form onSubmit={handleSubmit(handleCreate)}>
            <ModalBody className='flex flex-col gap-5'>
              <div className='flex flex-col md:flex-row items-center gap-5'>
                <div className='md:w-1/2 flex flex-col w-full items-center'>
                  <Select label='Year completed eg. 2019' {...register('year')}>
                    {yearRange.map((yearValue) => (
                      <SelectItem
                        key={yearValue.toString()}
                        value={yearValue.toString()}
                      >
                        {yearValue.toString()}
                      </SelectItem>
                    ))}
                  </Select>
                  <span className='px-2 text-danger'>
                    {errors.year?.message}
                  </span>
                </div>
                <div className='md:w-1/2 flex flex-col w-full items-center'>
                  <Input
                    {...register('indexNo')}
                    placeholder='Index No. eg 0050308001'
                    size='lg'
                  />
                  <span className='px-2 text-danger'>
                    {errors.indexNo?.message}
                  </span>
                </div>
              </div>
              <div className='flex flex-col md:flex-row items-center gap-5'>
                <div className='md:w-1/2 flex flex-col w-full items-center'>
                  <Input {...register('firstname')} placeholder='First Name' />
                  <span className='px-2 text-danger'>
                    {errors.firstname?.message}
                  </span>
                </div>
                <div className='md:w-1/2 flex flex-col w-full items-center'>
                  <Input {...register('lastname')} placeholder='Last Name' />
                  <span className='px-2 text-danger'>
                    {errors.lastname?.message}
                  </span>
                </div>
              </div>
              <div className='flex flex-col md:flex-row items-center gap-5'>
                <div className='md:w-1/2 flex flex-col w-full items-center'>
                  <Input
                    {...register('othername')}
                    placeholder='Other Name(s)'
                  />
                  <span className='px-2 text-danger'>
                    {errors.othername?.message}
                  </span>
                </div>
                <div className='w-full md:w-1/2'>
                  <RadioGroup
                    label='Sex:'
                    orientation='horizontal'
                    {...register('sex')}
                  >
                    <Radio value='male'>Male</Radio>
                    <Radio value='female'>Female</Radio>
                  </RadioGroup>
                  <span className='px-2 text-danger'>
                    {errors.sex?.message}
                  </span>
                </div>
              </div>
              <div className='flex flex-col md:flex-row items-center gap-5'>
                <div className='md:w-1/2 flex flex-col w-full items-center'>
                  <Select label='Select Course' {...register('course')}>
                    {yearRange.map((yearValue) => (
                      <SelectItem
                        key={yearValue.toString()}
                        value={yearValue.toString()}
                      >
                        {yearValue.toString()}
                      </SelectItem>
                    ))}
                  </Select>
                  <span className='px-2 text-danger'>
                    {errors.course?.message}
                  </span>
                </div>
                <div className='md:w-1/2 flex flex-col w-full items-center'>
                  <Select
                    {...register('subjects')}
                    label='Subjects:'
                    items={yearRange}
                    labelPlacement='outside'
                    placeholder='Select subjects'
                    selectionMode='multiple'
                    isMultiline={true}
                    renderValue={(items) => {
                      return (
                        <div className='flex flex-wrap gap-2'>
                          {items.map((item: any) => (
                            <Chip key={item.key}>{item.textValue}</Chip>
                          ))}
                        </div>
                      )
                    }}
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
                  <span className='px-2 text-danger'>
                    {errors.subjects?.message}
                  </span>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button type='submit' color='primary'>
                Save Student
              </Button>
            </ModalFooter>
          </form>
        </>
      </ModalContent>
    </Modal>
  )
}

export default CreateModal