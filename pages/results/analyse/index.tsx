import { Card, CardBody, CardHeader } from '@nextui-org/react'
import BestSixSubjects from '@/components/BestSixSubjects'
import SubjectsPassed from '@/components/SubjectsPassed'
import TotalGradeBySubject from '@/components/TotalGradeBySubject'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { Student, Subject } from '@/libs/models'
import { getCookie } from 'cookies-next'

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const yearGroup = getCookie('year', { req, res }) as string
  if (yearGroup) {
    const students = JSON.stringify(
      await Student.findAll({
        where: {
          yearGroup: yearGroup,
        },
        order: [['indexNo', 'ASC']],
        include: { model: Subject },
      })
    )
    const subjects = JSON.stringify(
      await Subject.findAll({
        order: [['code', 'ASC']],
        include: { model: Student, where: { yearGroup: yearGroup } },
      })
    )
    return {
      props: {
        students: JSON.parse(students),
        subjects: JSON.parse(subjects),
        yearGroup,
      },
    }
  } else {
    return {
      redirect: {
        permanent: false,
        destination: '/dashboard',
      },
      props: {},
    }
  }
}

const ResultsAnalysisPage = ({
  students,
  subjects,
  yearGroup,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <main className='px-2 pt-2 min-h-[90vh]'>
      <Card className='min-h-[88vh]'>
        <CardHeader>
          <p className='uppercase text-center w-full md:text-[36px] font-bold'>
            Results Analysis{' '}
            {yearGroup ? `(${yearGroup}/${Number(yearGroup) + 1})` : ''}
          </p>
        </CardHeader>
        <CardBody className='p-2 md:p-5'>
          <div className='flex flex-col gap-10'>
            <BestSixSubjects students={students} />
            <SubjectsPassed students={students} />
            <TotalGradeBySubject subjects={subjects} />
          </div>
        </CardBody>
      </Card>
    </main>
  )
}

export default ResultsAnalysisPage
