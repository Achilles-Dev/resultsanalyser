import {
  Table,
  TableBody,
  TableHeader,
  TableColumn,
  TableRow,
  TableCell,
} from "@heroui/react"
import { useMemo, useState } from 'react'

const BestSixSubjects = ({ students }: { students: any[] }) => {
  const [message, setMessage] = useState('')

  const maleNumber = students.filter((student) => student.sex === 'male').length
  const femaleNumber = students.length - maleNumber

  const calculateSixSubjects = () => {
    const maleFemale: { male: number; female: number } = {
      male: 0,
      female: 0,
    }
    let bestSix = {
      bestSix24: maleFemale,
      bestSix36: maleFemale,
      bestSixOver36: maleFemale,
      allFail: maleFemale,
      absent: maleFemale,
      cancelled: maleFemale,
      withheld: maleFemale
    }
    let count = 0
    students.forEach((student) => {
      let studBest = 0
      let lessCore = 9
      let elective: number[] = []
      student.Subjects.forEach((subject: any) => {
        //Best 3 core subject grades including Maths and English
        if (subject.type === 'core') {
          if (subject.name === 'English Lang' && subject.Grade.grade) {
            studBest += Number(subject.Grade.grade.charAt(1))
          } else if (
            subject.name === 'Mathematics(Core)' &&
            subject.Grade.grade
          ) {
            studBest += Number(subject.Grade.grade.charAt(1))
          } else if (
            subject.Grade.grade &&
            lessCore > Number(subject.Grade.grade.charAt(1))
          ) {
            lessCore = Number(subject.Grade.grade.charAt(1))
          }
          // Best 3 elective subject grades
        } else {
          let electiveIndex = elective.length - 1
          if (subject.Grade.grade && elective.length === 0) {
            elective.push(Number(subject.Grade.grade.charAt(1)))
          } else if (
            subject.Grade.grade &&
            Number(subject.Grade.grade.charAt(1)) > elective[electiveIndex]
          ) {
            elective.push(Number(subject.Grade.grade.charAt(1)))
          } else {
            subject.Grade.grade &&
              elective.unshift(Number(subject.Grade.grade.charAt(1)))
          }
        }

      })

      // Get Absent students and students with all results cancelled or withheld
      const allWithheld = student.Subjects.filter(
        (subject: any) =>
          subject.Grade.grade === "" && (subject.Grade.status === "Withheld")
      ).length
      const allAbsent = student.Subjects.filter(
        (subject: any) =>
          subject.Grade.grade === "" && (subject.Grade.status === "Absent")
      ).length
      const allCancelled = student.Subjects.filter(
        (subject: any) =>
          subject.Grade.grade === "" && (subject.Grade.status === "Cancelled")
      ).length
      if (allAbsent === 8) {
        if (student.sex === 'male') {
          bestSix = {
            ...bestSix,
            absent: {
              ...bestSix.absent,
              male: bestSix.absent.male + 1,
            },
          }
        } else {
          bestSix = {
            ...bestSix,
            absent: {
              ...bestSix.absent,
              female: bestSix.absent.female + 1,
            },
          }
        }
      }
      if (allCancelled === 8) {
        if (student.sex === 'male') {
          bestSix = {
            ...bestSix,
            cancelled: {
              ...bestSix.cancelled,
              male: bestSix.cancelled.male + 1,
            },
          }
        } else {
          bestSix = {
            ...bestSix,
            cancelled: {
              ...bestSix.cancelled,
              female: bestSix.cancelled.female + 1,
            },
          }
        }
      }
      if (allWithheld === 8) {
        if (student.sex === 'male') {
          bestSix = {
            ...bestSix,
            withheld: {
              ...bestSix.withheld,
              male: bestSix.withheld.male + 1,
            },
          }
        } else {
          bestSix = {
            ...bestSix,
            withheld: {
              ...bestSix.withheld,
              female: bestSix.withheld.female + 1,
            },
          }
        }
      }
      //Check if all Results are Recorded
      const noResults = student.Subjects.find(
        (subject: any) => subject.Grade.grade === null
      )
      if (noResults) {
        console.log("No Results:",student)
        count += 1
        setMessage(
          `${
            count > 1 ? `${count} Students have` : ' A Student has'
          } unrecorded results !!!`
        )
      }

      //Failed all subjects
      let allFail = student.Subjects.filter(
        (subject: any) =>
          (subject.Grade.grade && Number(subject.Grade.grade.charAt(1)) > 6) || 
        (subject.Grade.grade === "" && (subject.Grade.status === "Withheld" || subject.Grade.status === "Cancelled" || 
          subject.Grade.status === "Absent"))).length
      
      if (allFail === 8 && allWithheld < 8 && allCancelled < 8 && allAbsent < 8) {
        // console.log("Student", student)
        if (student.sex === 'male') {
          bestSix = {
            ...bestSix,
            allFail: {
              ...bestSix.allFail,
              male: bestSix.allFail.male + 1,
            },
          }
        } else {
          bestSix = {
            ...bestSix,
            allFail: {
              ...bestSix.allFail,
              female: bestSix.allFail.female + 1,
            },
          }
        }
      }

      if (studBest > 0) {
        studBest += lessCore
      }
      elective.pop()
      studBest += elective.reduce((a, b) => a + b, 0)
      if (studBest > 0 && studBest <= 24) {
        if (student.sex === 'male') {
          bestSix = {
            ...bestSix,
            bestSix24: {
              ...bestSix.bestSix24,
              male: bestSix.bestSix24.male + 1,
            },
          }
        } else {
          bestSix = {
            ...bestSix,
            bestSix24: {
              ...bestSix.bestSix24,
              female: bestSix.bestSix24.female + 1,
            },
          }
        }
      } else if (studBest > 0 && studBest <= 36) {
        if (student.sex === 'male') {
          bestSix = {
            ...bestSix,
            bestSix36: {
              ...bestSix.bestSix36,
              male: bestSix.bestSix36.male + 1,
            },
          }
        } else {
          bestSix = {
            ...bestSix,
            bestSix36: {
              ...bestSix.bestSix36,
              female: bestSix.bestSix36.female + 1,
            },
          }
        }
      } else {
        if (studBest > 0 && student.sex === 'male') {
          bestSix = {
            ...bestSix,
            bestSixOver36: {
              ...bestSix.bestSixOver36,
              male: bestSix.bestSixOver36.male + 1,
            },
          }
        } else if (studBest > 0) {
          bestSix = {
            ...bestSix,
            bestSixOver36: {
              ...bestSix.bestSixOver36,
              female: bestSix.bestSixOver36.female + 1,
            },
          }
        }
      }
    })
    return bestSix
  }
  const bestSubjects = useMemo(() => calculateSixSubjects(), [])

  return (
    <div className='flex flex-col gap-3'>
      <p className='text-danger text-center text-[20px]'>{message}</p>
      <Table aria-label='Best six subjects table'>
        <TableHeader className='text-[16px]'>
          <TableColumn className='text-[16px]' key='item'>
            Item
          </TableColumn>
          <TableColumn className='text-[16px]' key='Male'>
            Male
          </TableColumn>
          <TableColumn className='text-[16px]' key='Female'>
            Female
          </TableColumn>
          <TableColumn className='text-[16px]' key='Total'>
            Total
          </TableColumn>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className='py-4 text-[16px]'>
              Number of students
            </TableCell>
            <TableCell className='py-4'>{maleNumber}</TableCell>
            <TableCell className='py-4'>{femaleNumber}</TableCell>
            <TableCell className='py-4'>{students.length}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className='py-4 text-[16px]'>
              {/* Candidates with best 6 subjects less than or equals to 24 */}
                Candidates who obtained (Aggregate 6 - 24)
              
            </TableCell>
            <TableCell className='py-4'>
              {bestSubjects.bestSix24.male}
            </TableCell>
            <TableCell className='py-4'>
              {bestSubjects.bestSix24.female}
            </TableCell>
            <TableCell className='py-4'>
              {bestSubjects.bestSix24.male + bestSubjects.bestSix24.female}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className='py-4 text-[16px]'>
              {/* Candidates with best 6 subjects less than or equals to 36 */}
              Candidates who obtained (Aggregate 6 - 36)
            </TableCell>
            <TableCell className='py-4'>
              {bestSubjects.bestSix36.male}
            </TableCell>
            <TableCell className='py-4'>
              {bestSubjects.bestSix36.female}
            </TableCell>
            <TableCell className='py-4'>
              {bestSubjects.bestSix36.male + bestSubjects.bestSix36.female}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className='py-4 text-[16px]'>
              {/* Candidates with best 6 subjects greater than 36 */}
              Cnadidates who obtained (More than Aggregate 36)
            </TableCell>
            <TableCell className='py-4'>
              {bestSubjects.bestSixOver36.male}
            </TableCell>
            <TableCell className='py-4'>
              {bestSubjects.bestSixOver36.female}
            </TableCell>
            <TableCell className='py-4'>
              {bestSubjects.bestSixOver36.male +
                bestSubjects.bestSixOver36.female}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className='py-4 text-[16px]'>
              Candidates who (failed in all subjects)
            </TableCell>
            <TableCell className='py-4'>{bestSubjects.allFail.male}</TableCell>
            <TableCell className='py-4'>
              {bestSubjects.allFail.female}
            </TableCell>
            <TableCell className='py-4'>
              {bestSubjects.allFail.male + bestSubjects.allFail.female}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className='py-4 text-[16px]'>
              Candidates who had (entire results Cancelled)
            </TableCell>
            <TableCell className='py-4'>{bestSubjects.cancelled.male}</TableCell>
            <TableCell className='py-4'>
              {bestSubjects.cancelled.female}
            </TableCell>
            <TableCell className='py-4'>
              {bestSubjects.cancelled.male + bestSubjects.cancelled.female}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className='py-4 text-[16px]'>
              Candidates who were (Absent in all subjects)
            </TableCell>
            <TableCell className='py-4'>{bestSubjects.absent.male}</TableCell>
            <TableCell className='py-4'>
              {bestSubjects.absent.female}
            </TableCell>
            <TableCell className='py-4'>
              {bestSubjects.absent.male + bestSubjects.absent.female}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className='py-4 text-[16px]'>
              Candidates who had (entire results Withheld)
            </TableCell>
            <TableCell className='py-4'>{bestSubjects.withheld.male}</TableCell>
            <TableCell className='py-4'>
              {bestSubjects.withheld.female}
            </TableCell>
            <TableCell className='py-4'>
              {bestSubjects.withheld.male + bestSubjects.withheld.female}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <div>
        <p className='text-sky-600'>
          ** NB: (Agg 6_24 & Agg 6_36) ie. 3 elective subjects + Maths + English
          + (1 of either Science/Social)
        </p>
      </div>
    </div>
  )
}

export default BestSixSubjects