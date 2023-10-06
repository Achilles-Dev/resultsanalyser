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
  { value: '*', name: 'Abscent' },
]

interface EditModalProps {
  open: boolean
  setOpen: (value: boolean) => void
  handleEdit: (data: any) => void
  register: any
  handleSubmit: any
  errors: any
  headerName: string
  name: string
  buttonName: string
  control: any
  courses?: any[]
  subjects?: any[]
  setSelectedCourse?: (value: string) => void
  updateStatus?: string
}

const EditModal = (props: EditModalProps) => {
  const {
    open,
    setOpen,
    handleEdit,
    handleSubmit,
    register,
    errors,
    headerName,
    name,
    buttonName,
    control,
    courses,
    subjects,
    setSelectedCourse,
    updateStatus,
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
          <form onSubmit={handleSubmit(handleEdit)}>
            {name === 'Students' && (
              <ModalBody className='flex flex-col gap-5'>
                <div className='flex flex-col md:flex-row items-center gap-5'>
                  <div className='md:w-1/2 flex flex-col w-full items-center'>
                    <Controller
                      control={control}
                      name='year'
                      render={({ field: { onChange, value } }) => (
                        <Select
                          label='Year completed eg. 2019'
                          onChange={onChange}
                          selectedKeys={new Set([value.toString()])}
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
                      )}
                    />

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
                    <Controller
                      control={control}
                      name='sex'
                      render={({ field: { onChange, value } }) => {
                        return (
                          <RadioGroup
                            label='Sex:'
                            orientation='horizontal'
                            value={value}
                            onValueChange={onChange}
                          >
                            <Radio value='Male'>Male</Radio>
                            <Radio value='Female'>Female</Radio>
                          </RadioGroup>
                        )
                      }}
                    />
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
                    <Controller
                      control={control}
                      name='subjects'
                      render={({ field: { onChange, value } }) => {
                        let myValues = value.split(',')

                        return (
                          <Select
                            label='Subjects:'
                            items={subjects}
                            labelPlacement='outside'
                            placeholder='Select subjects'
                            selectionMode='multiple'
                            selectedKeys={new Set([...myValues])}
                            onChange={onChange}
                            isMultiline={true}
                            renderValue={(items) => {
                              return (
                                <div className='flex flex-wrap gap-2 py-2'>
                                  {items.map((item: any) => (
                                    <Chip key={item.key}>{item.textValue}</Chip>
                                  ))}
                                </div>
                              )
                            }}
                          >
                            {subjects !== undefined
                              ? subjects.map((subject) => (
                                  <SelectItem
                                    key={subject.id}
                                    value={subject.id}
                                  >
                                    {subject.name}
                                  </SelectItem>
                                ))
                              : []}
                          </Select>
                        )
                      }}
                    />
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
                  <Controller
                    control={control}
                    name='electiveSubjects'
                    render={({ field: { onChange, value } }) => {
                      let myValues = value.split(',')
                      return (
                        <Select
                          label='Elective Subjects:'
                          items={yearRange}
                          labelPlacement='outside'
                          placeholder='Select subjects'
                          selectionMode='multiple'
                          selectedKeys={new Set([...myValues])}
                          onChange={onChange}
                          isMultiline={true}
                          renderValue={(items) => {
                            return (
                              <div className='flex flex-wrap gap-2 py-2'>
                                {items.map((item: any) => (
                                  <Chip key={item.key}>{item.textValue}</Chip>
                                ))}
                              </div>
                            )
                          }}
                        >
                          {subjects !== undefined
                            ? subjects.map((subject) => (
                                <SelectItem key={subject.id} value={subject.id}>
                                  {subject.name}
                                </SelectItem>
                              ))
                            : []}
                        </Select>
                      )
                    }}
                  />
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
                  <Controller
                    control={control}
                    name='type'
                    render={({ field: { onChange, value } }) => (
                      <Select
                        label='Subject type'
                        onChange={onChange}
                        selectedKeys={new Set([value])}
                      >
                        {subjectType.map((subject) => (
                          <SelectItem key={subject.value} value={subject.value}>
                            {subject.name}
                          </SelectItem>
                        ))}
                      </Select>
                    )}
                  />
                  <span className='px-2 text-danger'>
                    {errors.type?.message}
                  </span>
                </div>

                <div className='flex flex-col w-full items-center'>
                  <Input {...register('name')} placeholder='Name of Subject' />
                  <span className='px-2 text-danger'>
                    {errors.tname?.message}
                  </span>
                </div>
              </ModalBody>
            )}
            {name === 'Grades' && (
              <ModalBody className='flex flex-col gap-5'>
                <div className='flex flex-col w-full items-center'>
                  <Input
                    type='number'
                    {...register('gradeValue')}
                    placeholder='Grade value'
                  />
                  <span className='px-2 text-danger'>
                    {errors.gradeValue?.message}
                  </span>
                </div>
                <div className='flex flex-col w-full items-center'>
                  <Controller
                    control={control}
                    name='type'
                    render={({ field: { onChange, value } }) => (
                      <Select label='Grade' {...register('name')}>
                        {grades.map((grade) => (
                          <SelectItem key={grade.value} value={grade.value}>
                            {grade.name}
                          </SelectItem>
                        ))}
                      </Select>
                    )}
                  />
                  <span className='px-2 text-danger'>
                    {errors.name?.message}
                  </span>
                </div>
              </ModalBody>
            )}
            <ModalFooter>
              <Button color='danger' onPress={(e) => setOpen(false)}>
                Close
              </Button>
              <Button
                type='submit'
                color='primary'
                isLoading={updateStatus === 'loading' ? true : false}
              >
                {buttonName}
              </Button>
            </ModalFooter>
          </form>
        </>
      </ModalContent>
    </Modal>
  )
}

export default EditModal
