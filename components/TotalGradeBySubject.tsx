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
        if (student.sex === 'Male') {
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
              <p>No.</p>
            </div>
          </TableColumn>
          <TableColumn key='subject' className='!px-0 border-x-1'>
            <div className='flex flex-col py-2 items-center min-w-[70px] w-[130px]'>
              <p>Subject</p>
            </div>
          </TableColumn>
          <TableColumn key='totalCandidates' className='!px-0 border-x-1'>
            <div className='flex flex-col py-2 items-center min-w-[70px] w-[140px] px-2'>
              <p className='flex w-full'>
                Total No. of <br />
                Candidates Presented
              </p>
              <div className='flex w-full pt-2 text-center'>
                <p className='w-[50%] border-e-2'>M</p>
                <p className='w-[50%]'>F</p>
              </div>
            </div>
          </TableColumn>
          <TableColumn key='absent' className='!px-0 border-x-1'>
            <div className='flex flex-col py-2 items-center min-w-[70px] px-1'>
              <p>Total No. Absent</p>
              <div className='flex w-full pt-2 text-center'>
                <p className='w-[50%] border-e-2'>M</p>
                <p className='w-[50%]'>F</p>
              </div>
            </div>
          </TableColumn>
          <TableColumn key='cancelled' className='!px-0 border-x-1'>
            <div className='flex flex-col py-2 items-center min-w-[70px] px-1'>
              <p>Total No. Cancelled</p>
              <div className='flex w-full pt-2 text-center'>
                <p className='w-[50%] border-e-2'>M</p>
                <p className='w-[50%]'>F</p>
              </div>
            </div>
          </TableColumn>
          <TableColumn key='withheld' className='!px-0 border-x-1'>
            <div className='flex flex-col py-2 items-center min-w-[70px] px-1'>
              <p>Results WithHeld</p>
              <div className='flex w-full pt-2 text-center'>
                <p className='w-[50%] border-e-2'>M</p>
                <p className='w-[50%]'>F</p>
              </div>
            </div>
          </TableColumn>
          <TableColumn key='a1' className='!px-0 border-x-1'>
            <div className='flex flex-col py-2 items-center min-w-[70px] px-1'>
              <p>A1</p>
              <div className='flex w-full pt-2 text-center'>
                <p className='w-[50%] border-e-2'>M</p>
                <p className='w-[50%]'>F</p>
              </div>
            </div>
          </TableColumn>
          <TableColumn key='b2' className='!px-0 border-x-1'>
            <div className='flex flex-col py-2 items-center min-w-[70px] px-1'>
              <p>B2</p>
              <div className='flex w-full pt-2 text-center'>
                <p className='w-[50%] border-e-2'>M</p>
                <p className='w-[50%]'>F</p>
              </div>
            </div>
          </TableColumn>
          <TableColumn key='b3' className='!px-0 border-x-1'>
            <div className='flex flex-col py-2 items-center min-w-[70px] px-1'>
              <p>B3</p>
              <div className='flex w-full pt-2 text-center'>
                <p className='w-[50%] border-e-2'>M</p>
                <p className='w-[50%]'>F</p>
              </div>
            </div>
          </TableColumn>
          <TableColumn key='c4' className='!px-0 border-x-1'>
            <div className='flex flex-col py-2 items-center min-w-[70px] px-1'>
              <p>C4</p>
              <div className='flex w-full pt-2 text-center'>
                <p className='w-[50%] border-e-2'>M</p>
                <p className='w-[50%]'>F</p>
              </div>
            </div>
          </TableColumn>
          <TableColumn key='c5' className='!px-0 border-x-1'>
            <div className='flex flex-col py-2 items-center min-w-[70px] px-1'>
              <p>C5</p>
              <div className='flex w-full pt-2 text-center'>
                <p className='w-[50%] border-e-2'>M</p>
                <p className='w-[50%]'>F</p>
              </div>
            </div>
          </TableColumn>
          <TableColumn key='c6' className='!px-0 border-x-1'>
            <div className='flex flex-col py-2 items-center min-w-[70px] px-1'>
              <p>C6</p>
              <div className='flex w-full pt-2 text-center'>
                <p className='w-[50%] border-e-2'>M</p>
                <p className='w-[50%]'>F</p>
              </div>
            </div>
          </TableColumn>
          <TableColumn key='d7' className='!px-0 border-x-1'>
            <div className='flex flex-col py-2 items-center min-w-[70px] px-1'>
              <p>D7</p>
              <div className='flex w-full pt-2 text-center'>
                <p className='w-[50%] border-e-2'>M</p>
                <p className='w-[50%]'>F</p>
              </div>
            </div>
          </TableColumn>
          <TableColumn key='e8' className='!px-0 border-x-1'>
            <div className='flex flex-col py-2 items-center min-w-[70px] px-1'>
              <p>E8</p>
              <div className='flex w-full pt-2 text-center'>
                <p className='w-[50%] border-e-2'>M</p>
                <p className='w-[50%]'>F</p>
              </div>
            </div>
          </TableColumn>
          <TableColumn key='f9' className='!px-0 border-x-1'>
            <div className='flex flex-col py-2 items-center min-w-[70px] px-1'>
              <p>F9</p>
              <div className='flex w-full pt-2 text-center'>
                <p className='w-[50%] border-e-2'>M</p>
                <p className='w-[50%]'>F</p>
              </div>
            </div>
          </TableColumn>
        </TableHeader>
        <TableBody>
          {subjectsGrades.map((subject, index) => (
            <TableRow className='border-x-1'>
              <TableCell>{index + 1}</TableCell>
              <TableCell className='border-x-1 !px-0'>{subject.name}</TableCell>
              <TableCell className='border-x-1 !px-0'>
                <div className='flex w-full pt-2 text-center'>
                  <p className='w-[50%] border-e-2'>
                    {subject.values.totalCandidates.male}
                  </p>
                  <p className='w-[50%]'>
                    {subject.values.totalCandidates.female}
                  </p>
                </div>
              </TableCell>
              <TableCell className='border-x-1 !px-0'>
                <div className='flex w-full pt-2 text-center'>
                  <p className='w-[50%] border-e-2'>1</p>
                  <p className='w-[50%]'>2</p>
                </div>
              </TableCell>
              <TableCell className='border-x-1 !px-0'>
                <div className='flex w-full pt-2 text-center'>
                  <p className='w-[50%] border-e-2'>1</p>
                  <p className='w-[50%]'>2</p>
                </div>
              </TableCell>
              <TableCell className='border-x-1 !px-0'>
                <div className='flex w-full pt-2 text-center'>
                  <p className='w-[50%] border-e-2'>1</p>
                  <p className='w-[50%]'>2</p>
                </div>
              </TableCell>
              <TableCell className='border-x-1 !px-0'>
                <div className='flex w-full pt-2 text-center'>
                  <p className='w-[50%] border-e-2'>{subject.values.A1.male}</p>
                  <p className='w-[50%]'>{subject.values.A1.female}</p>
                </div>
              </TableCell>
              <TableCell className='border-x-1 !px-0'>
                <div className='flex w-full pt-2 text-center'>
                  <p className='w-[50%] border-e-2'>{subject.values.B2.male}</p>
                  <p className='w-[50%]'>{subject.values.B2.female} </p>
                </div>
              </TableCell>
              <TableCell className='border-x-1 !px-0'>
                <div className='flex w-full pt-2 text-center'>
                  <p className='w-[50%] border-e-2'>{subject.values.B3.male}</p>
                  <p className='w-[50%]'>{subject.values.B3.female}</p>
                </div>
              </TableCell>
              <TableCell className='border-x-1 !px-0'>
                <div className='flex w-full pt-2 text-center'>
                  <p className='w-[50%] border-e-2'>{subject.values.C4.male}</p>
                  <p className='w-[50%]'>{subject.values.C4.female}</p>
                </div>
              </TableCell>
              <TableCell className='border-x-1 !px-0'>
                <div className='flex w-full pt-2 text-center'>
                  <p className='w-[50%] border-e-2'>{subject.values.C5.male}</p>
                  <p className='w-[50%]'>{subject.values.C5.female}</p>
                </div>
              </TableCell>
              <TableCell className='border-x-1 !px-0'>
                <div className='flex w-full pt-2 text-center'>
                  <p className='w-[50%] border-e-2'>{subject.values.C6.male}</p>
                  <p className='w-[50%]'>{subject.values.C6.female}</p>
                </div>
              </TableCell>
              <TableCell className='border-x-1 !px-0'>
                <div className='flex w-full pt-2 text-center'>
                  <p className='w-[50%] border-e-2'>{subject.values.D7.male}</p>
                  <p className='w-[50%]'>{subject.values.D7.female}</p>
                </div>
              </TableCell>
              <TableCell className='border-x-1 !px-0'>
                <div className='flex w-full pt-2 text-center'>
                  <p className='w-[50%] border-e-2'>{subject.values.E8.male}</p>
                  <p className='w-[50%]'>{subject.values.E8.female}</p>
                </div>
              </TableCell>
              <TableCell className='border-x-1 !px-0'>
                <div className='flex w-full pt-2 text-center'>
                  <p className='w-[50%] border-e-2'>{subject.values.F9.male}</p>
                  <p className='w-[50%]'>{subject.values.F9.female}</p>
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
