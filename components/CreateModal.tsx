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
import { Controller } from 'react-hook-form'

const currentYear = new Date().getFullYear()
const yearRange = Array.from(
  { length: 20 },
  (_, i) => currentYear + 2 + i * -1
).reverse()

const subjectType = [
  { index: 1, value: 'core', name: 'Core Subject' },
  { index: 2, value: 'elective', name: 'Elective Subject' },
]

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
  { value: 'W', name: 'Withheld' },
  { value: 'H', name: 'Canceled' },
  { value: '*', name: 'Absent' },
]

interface CreateModalProps {
  open: boolean
  setOpen: (value: boolean) => void
  handleCreate: (data: any) => void
  register: any
  handleSubmit: any
  errors: any
  headerName: string
  name: string
  buttonName: string
  courses?: any[]
  subjects?: any[]
  control?: any
  setSelectedCourse?: (value: string) => void
  saveStatus?: string
}

const CreateModal = (props: CreateModalProps) => {
  const {
    open,
    setOpen,
    handleCreate,
    handleSubmit,
    register,
    errors,
    headerName,
    name,
    buttonName,
    courses,
    subjects,
    control,
    setSelectedCourse,
    saveStatus,
  } = props
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
            {headerName}
          </ModalHeader>
          <form onSubmit={handleSubmit(handleCreate)}>
            {name === 'Students' && (
              <ModalBody className='flex flex-col gap-5'>
                <div className='flex flex-col md:flex-row items-center gap-5'>
                  <div className='md:w-1/2 flex flex-col w-full items-center'>
                    <Select
                      label='Year completed eg. 2019'
                      {...register('year')}
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
                    <Input
                      {...register('firstname')}
                      placeholder='First Name'
                    />
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
                      <Radio value='male' {...register('sex')}>
                        Male
                      </Radio>
                      <Radio value='female' {...register('sex')}>
                        Female
                      </Radio>
                    </RadioGroup>
                    <span className='px-2 text-danger'>
                      {errors.sex?.message}
                    </span>
                  </div>
                </div>
                <div className='flex flex-col md:flex-row items-center gap-5'>
                  <div className='md:w-1/2 flex flex-col w-full items-center'>
                    <Controller
                      control={control}
                      name='course'
                      render={({ field: { onChange, value } }) => {
                        setSelectedCourse !== undefined &&
                          setSelectedCourse(value)
                        return (
                          <Select
                            label='Select Course'
                            onChange={onChange}
                            selectedKeys={new Set([value])}
                          >
                            {courses !== undefined
                              ? courses.map((course) => (
                                  <SelectItem key={course.id} value={course.id}>
                                    {course.name}
                                  </SelectItem>
                                ))
                              : []}
                          </Select>
                        )
                      }}
                    />
                    <span className='px-2 text-danger'>
                      {errors.course?.message}
                    </span>
                  </div>
                  <div className='md:w-1/2 flex flex-col w-full items-center'>
                    <Select
                      {...register('subjects')}
                      label='Subjects:'
                      items={subjects}
                      labelPlacement='outside'
                      placeholder='Select subjects'
                      selectionMode='multiple'
                      isMultiline={true}
                      renderValue={(items) => {
                        return (
                          <div className='flex flex-wrap gap-2 py-2'>
                            {items.map((item: any) => (
                              <Chip key={item.id}>{item.textValue}</Chip>
                            ))}
                          </div>
                        )
                      }}
                    >
                      {subjects !== undefined &&
                        subjects.map((subject) => (
                          <SelectItem key={subject.id} value={subject.id}>
                            {subject.name}
                          </SelectItem>
                        ))}
                    </Select>
                    <span className='px-2 text-danger'>
                      {errors.subjects?.message}
                    </span>
                  </div>
                </div>
              </ModalBody>
            )}
            {name === 'Courses' && (
              <ModalBody className='flex flex-col gap-5'>
                <div className='flex flex-col w-full items-center'>
                  <Input
                    type='number'
                    max={999}
                    min={100}
                    {...register('code')}
                    placeholder='Course code'
                  />
                  <span className='px-2 text-danger'>
                    {errors.code?.message}
                  </span>
                </div>

                <div className='flex flex-col w-full items-center'>
                  <Input {...register('name')} placeholder='Name of Course' />
                  <span className='px-2 text-danger'>
                    {errors.name?.message}
                  </span>
                </div>
                <div className='flex flex-col w-full items-center'>
                  <Select
                    {...register('electiveSubjects')}
                    label='Elective Subjects:'
                    items={subjects}
                    labelPlacement='outside'
                    placeholder='Select subjects'
                    selectionMode='multiple'
                    isMultiline={true}
                    renderValue={(items) => {
                      return (
                        <div className='flex flex-wrap gap-2 py-2'>
                          {items.map((item: any) => (
                            <Chip key={item.id}>{item.textValue}</Chip>
                          ))}
                        </div>
                      )
                    }}
                  >
                    {subjects &&
                      subjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id}>
                          {subject.name}
                        </SelectItem>
                      ))}
                  </Select>
                  <span className='px-2 text-danger'>
                    {errors.electiveSubjects?.message}
                  </span>
                </div>
              </ModalBody>
            )}
            {name === 'Subjects' && (
              <ModalBody className='flex flex-col gap-5'>
                <div className='flex flex-col w-full items-center'>
                  <Input
                    type='number'
                    max={999}
                    min={100}
                    {...register('code')}
                    placeholder='Subject code'
                  />
                  <span className='px-2 text-danger'>
                    {errors.code?.message}
                  </span>
                </div>
                <div className='flex flex-col w-full items-center'>
                  <Select label='Subject type' {...register('type')}>
                    {subjectType.map((subject) => (
                      <SelectItem key={subject.value} value={subject.value}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </Select>
                  <span className='px-2 text-danger'>
                    {errors.type?.message}
                  </span>
                </div>

                <div className='flex flex-col w-full items-center'>
                  <Input {...register('name')} placeholder='Name of Subject' />
                  <span className='px-2 text-danger'>
                    {errors.name?.message}
                  </span>
                </div>
              </ModalBody>
            )}
            {name === 'Grades' &&
            subjects &&
            subjects.length > 0 &&
            !subjects[0].Grade.grade ? (
              <ModalBody className='flex flex-col gap-5 p-2 md:px-6'>
                {subjects &&
                  subjects?.map((subject, index) => (
                    <div
                      key={subject.id}
                      className='flex w-full gap-2 md:gap-4'
                    >
                      <div className='flex w-full items-center justify-start'>
                        <p className='border bg-[#e5e7eb] opacity-70 text-black p-3 rounded-xl'>
                          {subject.name}
                        </p>
                      </div>
                      <div className='flex flex-col w-full items-center'>
                        <Controller
                          control={control}
                          name={
                            subject.type === 'core'
                              ? `core${index + 1}`
                              : `elective${index + 1}`
                          }
                          render={({ field: { onChange, value } }) => {
                            return (
                              <Select
                                label='Grade'
                                onChange={onChange}
                                selectedKeys={new Set([value])}
                              >
                                {grades.map((grade) => (
                                  <SelectItem
                                    key={grade.value}
                                    value={grade.value}
                                  >
                                    {grade.name}
                                  </SelectItem>
                                ))}
                              </Select>
                            )
                          }}
                        />
                        <span className='px-2 text-danger'>
                          {subject.type === 'core'
                            ? errors[`core${index + 1}`]?.message
                            : errors[`elective${index + 1}`]?.message}
                        </span>
                      </div>
                    </div>
                  ))}
              </ModalBody>
            ) : (
              <p className='flex flex-col gap-5 p-2 md:px-6'>
                Results already exists! Edit instead
              </p>
            )}
            <ModalFooter>
              <Button color='danger' onPress={(e) => setOpen(false)}>
                Close
              </Button>
              {name !== 'Grades' ||
              (name === 'Grades' &&
                subjects &&
                subjects.length > 0 &&
                !subjects[0].Grade.grade) ? (
                <Button
                  type='submit'
                  color='primary'
                  isLoading={saveStatus === 'loading' ? true : false}
                >
                  {buttonName}
                </Button>
              ) : (
                ''
              )}
            </ModalFooter>
          </form>
        </>
      </ModalContent>
    </Modal>
  )
}

export default CreateModal
