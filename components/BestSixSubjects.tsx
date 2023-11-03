import {
  Table,
  TableBody,
  TableHeader,
  TableColumn,
  TableRow,
  TableCell,
} from '@nextui-org/react'
import { useMemo, useState } from 'react'

const BestSixSubjects = ({ students }: { students: any[] }) => {
  const maleNumber = students.filter((student) => student.sex === 'Male').length
  const femaleNumber = students.length - maleNumber

  const calculateSixSubjects = () => {
    let bestSixMale24 = 0
    let bestSixFemale24 = 0
    let bestSixMale36 = 0
    let bestSixFemale36 = 0
    let bestSixMaleOver36 = 0
    let bestSixFemaleOver36 = 0
    let maleAllfail = 0
    let femaleAllFail = 0
    students.forEach((student) => {
      let studBest = 0
      let lessCore = 9
      let elective: number[] = []
      student.Subjects.forEach((subject: any) => {
        //Best 3 core subject grades including Maths and English
        if (subject.type === 'core') {
          if (subject.name === 'English Language' && subject.Grade.grade) {
            studBest += Number(subject.Grade.grade.charAt(1))
          } else if (
            subject.name === 'Mathematics (Core)' &&
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
      let allFail = student.Subjects.filter(
        (subject: any) =>
          subject.Grade.grade && Number(subject.Grade.grade.charAt(1)) > 6
      ).length
      if (allFail === 8) {
        if (student.sex === 'Male') {
          maleAllfail += 1
        } else {
          femaleAllFail += 1
        }
      }

      if (studBest > 0) {
        studBest += lessCore
      }
      elective.pop()
      studBest += elective.reduce((a, b) => a + b, 0)
      if (studBest > 0 && studBest <= 24) {
        if (student.sex === 'Male') {
          bestSixMale24 += 1
        } else {
          bestSixFemale24 += 1
        }
      } else if (studBest > 0 && studBest <= 36) {
        if (student.sex === 'Male') {
          bestSixMale36 += 1
        } else {
          bestSixFemale36 += 1
        }
      } else {
        if (studBest > 0 && student.sex === 'Male') {
          bestSixMaleOver36 += 1
        } else if (studBest > 0) {
          bestSixFemaleOver36 += 1
        }
      }
    })
    return {
      bestSixMale24,
      bestSixFemale24,
      bestSixMale36,
      bestSixFemale36,
      bestSixMaleOver36,
      bestSixFemaleOver36,
      maleAllfail,
      femaleAllFail,
    }
  }
  const bestSubjects = useMemo(() => calculateSixSubjects(), [])

  return (
    <div>
      <Table aria-label='Example table with client side sorting'>
        <TableHeader>
          <TableColumn key='item'>Item</TableColumn>
          <TableColumn key='Male'>Male</TableColumn>
          <TableColumn key='Female'>Female</TableColumn>
          <TableColumn key='Total'>Total</TableColumn>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className='py-4'>Number of students</TableCell>
            <TableCell className='py-4'>{maleNumber}</TableCell>
            <TableCell className='py-4'>{femaleNumber}</TableCell>
            <TableCell className='py-4'>{students.length}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className='py-4'>
              Candidates with best 6 subjects less than or equals to 24
            </TableCell>
            <TableCell className='py-4'>
              {bestSubjects.bestSixMale24}{' '}
            </TableCell>
            <TableCell className='py-4'>
              {bestSubjects.bestSixFemale24}
            </TableCell>
            <TableCell className='py-4'>
              {bestSubjects.bestSixMale24 + bestSubjects.bestSixFemale24}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className='py-4'>
              Candidates with best 6 subjects less than or equals to 36
            </TableCell>
            <TableCell className='py-4'>{bestSubjects.bestSixMale36}</TableCell>
            <TableCell className='py-4'>
              {bestSubjects.bestSixFemale36}{' '}
            </TableCell>
            <TableCell className='py-4'>
              {bestSubjects.bestSixMale36 + bestSubjects.bestSixFemale36}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className='py-4'>
              Candidates with best 6 subjects greater than 36
            </TableCell>
            <TableCell className='py-4'>
              {bestSubjects.bestSixMaleOver36}
            </TableCell>
            <TableCell className='py-4'>
              {bestSubjects.bestSixFemaleOver36}
            </TableCell>
            <TableCell className='py-4'>
              {bestSubjects.bestSixMaleOver36 +
                bestSubjects.bestSixFemaleOver36}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className='py-4'>
              Candidates who failed in all subjects
            </TableCell>
            <TableCell className='py-4'>{bestSubjects.maleAllfail}</TableCell>
            <TableCell className='py-4'>
              {bestSubjects.femaleAllFail}{' '}
            </TableCell>
            <TableCell className='py-4'>
              {bestSubjects.maleAllfail + bestSubjects.femaleAllFail}{' '}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}

export default BestSixSubjects
