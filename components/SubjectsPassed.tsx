import {
  Table,
  TableBody,
  TableHeader,
  TableColumn,
  TableRow,
  TableCell,
} from '@nextui-org/react'
import { useMemo } from 'react'

const SubjectsPassed = ({ students }: { students: any[] }) => {
  const subjectsPassed = () => {
    const maleFemale: { male: number; female: number } = {
      male: 0,
      female: 0,
    }
    let passed = {
      passed8: maleFemale,
      passed7: maleFemale,
      passed6: maleFemale,
      passed5: maleFemale,
      passed4: maleFemale,
      passed3: maleFemale,
      passed2: maleFemale,
      passed1: maleFemale,
      passed0: maleFemale,
    }
    students.forEach((student: any) => {
      let numberPassed = student.Subjects.filter(
        (subject: any) =>
          subject.Grade.grade && Number(subject.Grade.grade.charAt(1)) <= 6
      ).length

      if (student.Subjects[0].Grade.grade && student.sex === 'Male') {
        switch (numberPassed) {
          case 0:
            passed = {
              ...passed,
              passed0: {
                ...passed.passed0,
                male: passed.passed0.male + 1,
              },
            }
            break
          case 1:
            passed = {
              ...passed,
              passed1: {
                ...passed.passed1,
                male: passed.passed1.male + 1,
              },
            }
            break
          case 2:
            passed = {
              ...passed,
              passed2: {
                ...passed.passed2,
                male: passed.passed2.male + 1,
              },
            }
            break
          case 3:
            passed = {
              ...passed,
              passed3: {
                ...passed.passed3,
                male: passed.passed3.male + 1,
              },
            }
            break
          case 4:
            passed = {
              ...passed,
              passed4: {
                ...passed.passed4,
                male: passed.passed4.male + 1,
              },
            }
            break
          case 5:
            passed = {
              ...passed,
              passed5: {
                ...passed.passed5,
                male: passed.passed5.male + 1,
              },
            }
            break
          case 6:
            passed = {
              ...passed,
              passed6: {
                ...passed.passed6,
                male: passed.passed6.male + 1,
              },
            }
            break
          case 7:
            passed = {
              ...passed,
              passed7: {
                ...passed.passed7,
                male: passed.passed7.male + 1,
              },
            }
            break
          default:
            passed = {
              ...passed,
              passed8: {
                ...passed.passed8,
                male: passed.passed8.male + 1,
              },
            }
        }
      } else if (student.Subjects[0].Grade.grade) {
        switch (numberPassed) {
          case 0:
            passed = {
              ...passed,
              passed0: {
                ...passed.passed0,
                female: passed.passed0.female + 1,
              },
            }
            break
          case 1:
            passed = {
              ...passed,
              passed1: {
                ...passed.passed1,
                female: passed.passed1.female + 1,
              },
            }
            break
          case 2:
            passed = {
              ...passed,
              passed2: {
                ...passed.passed2,
                female: passed.passed2.female + 1,
              },
            }
            break
          case 3:
            passed = {
              ...passed,
              passed3: {
                ...passed.passed3,
                female: passed.passed3.female + 1,
              },
            }
            break
          case 4:
            passed = {
              ...passed,
              passed4: {
                ...passed.passed4,
                female: passed.passed4.female + 1,
              },
            }
            break
          case 5:
            passed = {
              ...passed,
              passed5: {
                ...passed.passed5,
                female: passed.passed5.female + 1,
              },
            }
            break
          case 6:
            passed = {
              ...passed,
              passed6: {
                ...passed.passed6,
                female: passed.passed6.female + 1,
              },
            }
            break
          case 7:
            passed = {
              ...passed,
              passed7: {
                ...passed.passed7,
                female: passed.passed7.female + 1,
              },
            }
            break
          default:
            passed = {
              ...passed,
              passed8: {
                ...passed.passed8,
                female: passed.passed8.female + 1,
              },
            }
        }
      }
    })
    return passed
  }

  const passedSubjects = useMemo(() => subjectsPassed(), [subjectsPassed])

  return (
    <div>
      <Table aria-label='Subject passed table'>
        <TableHeader>
          <TableColumn key='item'>
            <div className='flex flex-col py-2'>
              <span>Name Of School</span>
            </div>
          </TableColumn>
          <TableColumn key='Male'>
            <div className='flex flex-col border-b-1 py-2'>
              <span className='pt-2'>Total number of subjects passed</span>
              <div className='flex w-full mt-2'>
                {Array(9)
                  .fill(0)
                  .map((_, index) => {
                    let item = 8 - index
                    return (
                      <div
                        key={index}
                        className='w-[11.11%] min-w-[70px] px-1 border-x-1 text-center flex flex-col'
                      >
                        <span className='pt-2'>{item}</span>
                        <div className='flex w-full pt-2'>
                          <span className='w-[50%] border-e-2'>M</span>
                          <span className='w-[50%]'>F</span>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>
          </TableColumn>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Bosome SHTS</TableCell>
            <TableCell>
              <div className='flex text-center border-x-1'>
                <div className='flex w-full pt-2'>
                  <span className='w-[50%] border-e-2'>
                    {passedSubjects.passed8.male}
                  </span>
                  <span className='w-[50%]'>
                    {passedSubjects.passed8.female}
                  </span>
                </div>
                <div className='flex w-full pt-2'>
                  <span className='w-[50%] border-e-2'>
                    {passedSubjects.passed7.male}
                  </span>
                  <span className='w-[50%]'>
                    {passedSubjects.passed7.female}
                  </span>
                </div>
                <div className='flex w-full pt-2'>
                  <span className='w-[50%] border-e-2'>
                    {passedSubjects.passed6.male}
                  </span>
                  <span className='w-[50%]'>
                    {passedSubjects.passed6.female}
                  </span>
                </div>
                <div className='flex w-full pt-2'>
                  <span className='w-[50%] border-e-2'>
                    {passedSubjects.passed5.male}
                  </span>
                  <span className='w-[50%]'>
                    {passedSubjects.passed5.female}
                  </span>
                </div>
                <div className='flex w-full pt-2'>
                  <span className='w-[50%] border-e-2'>
                    {passedSubjects.passed4.male}
                  </span>
                  <span className='w-[50%]'>
                    {passedSubjects.passed4.female}
                  </span>
                </div>
                <div className='flex w-full pt-2'>
                  <span className='w-[50%] border-e-2'>
                    {passedSubjects.passed3.male}
                  </span>
                  <span className='w-[50%]'>
                    {passedSubjects.passed3.female}
                  </span>
                </div>
                <div className='flex w-full pt-2'>
                  <span className='w-[50%] border-e-2'>
                    {passedSubjects.passed2.male}
                  </span>
                  <span className='w-[50%]'>
                    {passedSubjects.passed2.female}
                  </span>
                </div>
                <div className='flex w-full pt-2'>
                  <span className='w-[50%] border-e-2'>
                    {passedSubjects.passed1.male}
                  </span>
                  <span className='w-[50%]'>
                    {passedSubjects.passed1.female}
                  </span>
                </div>
                <div className='flex w-full pt-2'>
                  <span className='w-[50%] border-e-2'>
                    {passedSubjects.passed0.male}
                  </span>
                  <span className='w-[50%]'>
                    {passedSubjects.passed0.female}
                  </span>
                </div>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}

export default SubjectsPassed
