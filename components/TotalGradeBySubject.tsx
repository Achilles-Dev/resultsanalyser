import { fetchSubjects } from '@/libs/api'
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react'
import { useMemo } from 'react'

const TotalGradeBySubject = ({ subjects }: { subjects: any[] }) => {
  const calculateTotalGrade = () => {
    let mySubjects = subjects.map((subject) => {
      const maleFemale: { male: number; female: number } = {
        male: 0,
        female: 0,
      }
      let values = {
        totalCandidates: maleFemale,
        absent: maleFemale,
        canceled: maleFemale,
        withheld: maleFemale,
        A1: maleFemale,
        B2: maleFemale,
        B3: maleFemale,
        C4: maleFemale,
        C5: maleFemale,
        C6: maleFemale,
        D7: maleFemale,
        E8: maleFemale,
        F9: maleFemale,
      }

      subject.Students.map((student: any) => {
        let grade = student.Grade.grade
        let status = student.Grade.status
        if (student.sex === 'male') {
          values = {
            ...values,
            totalCandidates: {
              ...values.totalCandidates,
              male: values.totalCandidates.male + 1,
            },
          }
          switch (grade) {
            case 'A1':
              values = {
                ...values,
                A1: {
                  ...values.A1,
                  male: values.A1.male + 1,
                },
              }
              break
            case 'B2':
              values = {
                ...values,
                B2: {
                  ...values.B2,
                  male: values.B2.male + 1,
                },
              }
              break
            case 'B3':
              values = {
                ...values,
                B3: {
                  ...values.B3,
                  male: values.B3.male + 1,
                },
              }
              break
            case 'C4':
              values = {
                ...values,
                C4: {
                  ...values.C4,
                  male: values.C4.male + 1,
                },
              }
              break
            case 'C5':
              values = {
                ...values,
                C5: {
                  ...values.C5,
                  male: values.C5.male + 1,
                },
              }
              break
            case 'C6':
              values = {
                ...values,
                C6: {
                  ...values.C6,
                  male: values.C6.male + 1,
                },
              }
              break
            case 'D7':
              values = {
                ...values,
                D7: {
                  ...values.D7,
                  male: values.D7.male + 1,
                },
              }
              break
            case 'E8':
              values = {
                ...values,
                E8: {
                  ...values.E8,
                  male: values.E8.male + 1,
                },
              }
              break
            case 'F9':
              values = {
                ...values,
                F9: {
                  ...values.F9,
                  male: values.F9.male + 1,
                },
              }
              break
            default:
              values
          }
          switch (status) {
            case 'Withheld':
              values = {
                ...values,
                withheld: {
                  ...values.withheld,
                  male: values.withheld.male + 1,
                },
              }
              break
            case 'Canceled':
              values = {
                ...values,
                canceled: {
                  ...values.canceled,
                  male: values.canceled.male + 1,
                },
              }
              break
            case 'Absent':
              values = {
                ...values,
                absent: {
                  ...values.absent,
                  male: values.absent.male + 1,
                },
              }
              break
            default:
              values
          }
        } else {
          values = {
            ...values,
            totalCandidates: {
              ...values.totalCandidates,
              female: values.totalCandidates.female + 1,
            },
          }
          switch (grade) {
            case 'A1':
              values = {
                ...values,
                A1: {
                  ...values.A1,
                  female: values.A1.female + 1,
                },
              }
              break
            case 'B2':
              values = {
                ...values,
                B2: {
                  ...values.B2,
                  female: values.B2.female + 1,
                },
              }
              break
            case 'B3':
              values = {
                ...values,
                B3: {
                  ...values.B3,
                  female: values.B3.female + 1,
                },
              }
              break
            case 'C4':
              values = {
                ...values,
                C4: {
                  ...values.C4,
                  female: values.C4.female + 1,
                },
              }
              break
            case 'C5':
              values = {
                ...values,
                C5: {
                  ...values.C5,
                  female: values.C5.female + 1,
                },
              }
              break
            case 'C6':
              values = {
                ...values,
                C6: {
                  ...values.C6,
                  female: values.C6.female + 1,
                },
              }
              break
            case 'D7':
              values = {
                ...values,
                D7: {
                  ...values.D7,
                  female: values.D7.female + 1,
                },
              }
              break
            case 'E8':
              values = {
                ...values,
                E8: {
                  ...values.E8,
                  female: values.E8.female + 1,
                },
              }
              break
            case 'F9':
              values = {
                ...values,
                F9: {
                  ...values.F9,
                  female: values.F9.female + 1,
                },
              }
              break
            default:
              values
          }
          switch (status) {
            case 'Withheld':
              values = {
                ...values,
                withheld: {
                  ...values.withheld,
                  female: values.withheld.female + 1,
                },
              }
              break
            case 'Canceled':
              values = {
                ...values,
                canceled: {
                  ...values.canceled,
                  female: values.canceled.female + 1,
                },
              }
              break
            case 'Absent':
              values = {
                ...values,
                absent: {
                  ...values.absent,
                  female: values.absent.female + 1,
                },
              }
              break
            default:
              values
          }
        }
      })
      return {
        ...subject,
        values,
      }
    })
    return mySubjects
  }

  const subjectsGrades: any[] = useMemo(() => calculateTotalGrade(), [])

  return (
    <div>
      <Table aria-label="Total grade by subject'/s table">
        <TableHeader>
          <TableColumn key='no' className='!px-0 border-x-1'>
            <div className='flex flex-col py-2 items-center min-w-[70px]'>
              <span>No.</span>
            </div>
          </TableColumn>
          <TableColumn key='subject' className='!px-0 border-x-1'>
            <div className='flex flex-col py-2 items-center min-w-[70px] w-[130px]'>
              <span>Subject</span>
            </div>
          </TableColumn>
          <TableColumn key='totalCandidates' className='!px-0 border-x-1'>
            <div className='flex flex-col py-2 items-center min-w-[70px] w-[150px] px-2'>
              <span className='flex w-full text-center'>
                No. of Candidates
                <br />
                Presented
              </span>
              <div className='flex w-full pt-2 text-center'>
                <span className='w-[50%] border-e-2'>M</span>
                <span className='w-[50%]'>F</span>
              </div>
            </div>
          </TableColumn>
          <TableColumn key='absent' className='!px-0 border-x-1'>
            <div className='flex flex-col py-2 items-center min-w-[70px] px-1'>
              <span>No. Absent</span>
              <div className='flex w-full pt-2 text-center'>
                <span className='w-[50%] border-e-2'>M</span>
                <span className='w-[50%]'>F</span>
              </div>
            </div>
          </TableColumn>
          <TableColumn key='cancelled' className='!px-0 border-x-1'>
            <div className='flex flex-col py-2 items-center min-w-[70px] px-1'>
              <span>No. Cancelled</span>
              <div className='flex w-full pt-2 text-center'>
                <span className='w-[50%] border-e-2'>M</span>
                <span className='w-[50%]'>F</span>
              </div>
            </div>
          </TableColumn>
          <TableColumn key='withheld' className='!px-0 border-x-1'>
            <div className='flex flex-col py-2 items-center min-w-[70px] px-1'>
              <span>Results WithHeld</span>
              <div className='flex w-full pt-2 text-center'>
                <span className='w-[50%] border-e-2'>M</span>
                <span className='w-[50%]'>F</span>
              </div>
            </div>
          </TableColumn>
          <TableColumn key='a1' className='!px-0 border-x-1'>
            <div className='flex flex-col py-2 items-center min-w-[70px] px-1'>
              <span>A1</span>
              <div className='flex w-full pt-2 text-center'>
                <span className='w-[50%] border-e-2'>M</span>
                <span className='w-[50%]'>F</span>
              </div>
            </div>
          </TableColumn>
          <TableColumn key='b2' className='!px-0 border-x-1'>
            <div className='flex flex-col py-2 items-center min-w-[70px] px-1'>
              <span>B2</span>
              <div className='flex w-full pt-2 text-center'>
                <span className='w-[50%] border-e-2'>M</span>
                <span className='w-[50%]'>F</span>
              </div>
            </div>
          </TableColumn>
          <TableColumn key='b3' className='!px-0 border-x-1'>
            <div className='flex flex-col py-2 items-center min-w-[70px] px-1'>
              <span>B3</span>
              <div className='flex w-full pt-2 text-center'>
                <span className='w-[50%] border-e-2'>M</span>
                <span className='w-[50%]'>F</span>
              </div>
            </div>
          </TableColumn>
          <TableColumn key='c4' className='!px-0 border-x-1'>
            <div className='flex flex-col py-2 items-center min-w-[70px] px-1'>
              <span>C4</span>
              <div className='flex w-full pt-2 text-center'>
                <span className='w-[50%] border-e-2'>M</span>
                <span className='w-[50%]'>F</span>
              </div>
            </div>
          </TableColumn>
          <TableColumn key='c5' className='!px-0 border-x-1'>
            <div className='flex flex-col py-2 items-center min-w-[70px] px-1'>
              <span>C5</span>
              <div className='flex w-full pt-2 text-center'>
                <span className='w-[50%] border-e-2'>M</span>
                <span className='w-[50%]'>F</span>
              </div>
            </div>
          </TableColumn>
          <TableColumn key='c6' className='!px-0 border-x-1'>
            <div className='flex flex-col py-2 items-center min-w-[70px] px-1'>
              <span>C6</span>
              <div className='flex w-full pt-2 text-center'>
                <span className='w-[50%] border-e-2'>M</span>
                <span className='w-[50%]'>F</span>
              </div>
            </div>
          </TableColumn>
          <TableColumn key='d7' className='!px-0 border-x-1'>
            <div className='flex flex-col py-2 items-center min-w-[70px] px-1'>
              <span>D7</span>
              <div className='flex w-full pt-2 text-center'>
                <span className='w-[50%] border-e-2'>M</span>
                <span className='w-[50%]'>F</span>
              </div>
            </div>
          </TableColumn>
          <TableColumn key='e8' className='!px-0 border-x-1'>
            <div className='flex flex-col py-2 items-center min-w-[70px] px-1'>
              <span>E8</span>
              <div className='flex w-full pt-2 text-center'>
                <span className='w-[50%] border-e-2'>M</span>
                <span className='w-[50%]'>F</span>
              </div>
            </div>
          </TableColumn>
          <TableColumn key='f9' className='!px-0 border-x-1'>
            <div className='flex flex-col py-2 items-center min-w-[70px] px-1'>
              <span>F9</span>
              <div className='flex w-full pt-2 text-center'>
                <span className='w-[50%] border-e-2'>M</span>
                <span className='w-[50%]'>F</span>
              </div>
            </div>
          </TableColumn>
        </TableHeader>
        <TableBody>
          {subjectsGrades.map((subject, index) => (
            <TableRow className='border-x-1' key={subject.id}>
              <TableCell className='!px-1 text-center'>{index + 1}</TableCell>
              <TableCell className='border-x-1 !px-1 text-center'>
                {subject.name}
              </TableCell>
              <TableCell className='border-x-1 !px-0'>
                <div className='flex w-full pt-2 text-center'>
                  <span className='w-[50%] border-e-2'>
                    {subject.values.totalCandidates.male}
                  </span>
                  <span className='w-[50%]'>
                    {subject.values.totalCandidates.female}
                  </span>
                </div>
              </TableCell>
              <TableCell className='border-x-1 !px-0'>
                <div className='flex w-full pt-2 text-center'>
                  <span className='w-[50%] border-e-2'>
                    {subject.values.absent.male}
                  </span>
                  <span className='w-[50%]'>
                    {subject.values.absent.female}
                  </span>
                </div>
              </TableCell>
              <TableCell className='border-x-1 !px-0'>
                <div className='flex w-full pt-2 text-center'>
                  <span className='w-[50%] border-e-2'>
                    {subject.values.canceled.male}
                  </span>
                  <span className='w-[50%]'>
                    {subject.values.canceled.female}
                  </span>
                </div>
              </TableCell>
              <TableCell className='border-x-1 !px-0'>
                <div className='flex w-full pt-2 text-center'>
                  <span className='w-[50%] border-e-2'>
                    {subject.values.withheld.male}
                  </span>
                  <span className='w-[50%]'>
                    {subject.values.withheld.female}
                  </span>
                </div>
              </TableCell>
              <TableCell className='border-x-1 !px-0'>
                <div className='flex w-full pt-2 text-center'>
                  <span className='w-[50%] border-e-2'>
                    {subject.values.A1.male}
                  </span>
                  <span className='w-[50%]'>{subject.values.A1.female}</span>
                </div>
              </TableCell>
              <TableCell className='border-x-1 !px-0'>
                <div className='flex w-full pt-2 text-center'>
                  <span className='w-[50%] border-e-2'>
                    {subject.values.B2.male}
                  </span>
                  <span className='w-[50%]'>{subject.values.B2.female} </span>
                </div>
              </TableCell>
              <TableCell className='border-x-1 !px-0'>
                <div className='flex w-full pt-2 text-center'>
                  <span className='w-[50%] border-e-2'>
                    {subject.values.B3.male}
                  </span>
                  <span className='w-[50%]'>{subject.values.B3.female}</span>
                </div>
              </TableCell>
              <TableCell className='border-x-1 !px-0'>
                <div className='flex w-full pt-2 text-center'>
                  <span className='w-[50%] border-e-2'>
                    {subject.values.C4.male}
                  </span>
                  <span className='w-[50%]'>{subject.values.C4.female}</span>
                </div>
              </TableCell>
              <TableCell className='border-x-1 !px-0'>
                <div className='flex w-full pt-2 text-center'>
                  <span className='w-[50%] border-e-2'>
                    {subject.values.C5.male}
                  </span>
                  <span className='w-[50%]'>{subject.values.C5.female}</span>
                </div>
              </TableCell>
              <TableCell className='border-x-1 !px-0'>
                <div className='flex w-full pt-2 text-center'>
                  <span className='w-[50%] border-e-2'>
                    {subject.values.C6.male}
                  </span>
                  <span className='w-[50%]'>{subject.values.C6.female}</span>
                </div>
              </TableCell>
              <TableCell className='border-x-1 !px-0'>
                <div className='flex w-full pt-2 text-center'>
                  <span className='w-[50%] border-e-2'>
                    {subject.values.D7.male}
                  </span>
                  <span className='w-[50%]'>{subject.values.D7.female}</span>
                </div>
              </TableCell>
              <TableCell className='border-x-1 !px-0'>
                <div className='flex w-full pt-2 text-center'>
                  <span className='w-[50%] border-e-2'>
                    {subject.values.E8.male}
                  </span>
                  <span className='w-[50%]'>{subject.values.E8.female}</span>
                </div>
              </TableCell>
              <TableCell className='border-x-1 !px-0'>
                <div className='flex w-full pt-2 text-center'>
                  <span className='w-[50%] border-e-2'>
                    {subject.values.F9.male}
                  </span>
                  <span className='w-[50%]'>{subject.values.F9.female}</span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default TotalGradeBySubject
