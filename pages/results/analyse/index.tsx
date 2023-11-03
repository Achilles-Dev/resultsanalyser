import { Card, CardBody, CardHeader } from '@nextui-org/react'
import BestSixSubjects from '@/components/BestSixSubjects'
import SubjectsPassed from '@/components/SubjectsPassed'
import TotalGradeBySubject from '@/components/TotalGradeBySubject'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { Student, Subject } from '@/libs/models'

export const getServerSideProps: GetServerSideProps = async () => {
  const students = JSON.stringify(
    await Student.findAll({
      order: [['indexNo', 'ASC']],
      include: { model: Subject },
    })
  )
  return {
    props: {
      students: JSON.parse(students),
    },
  }
}

const ResultsAnalysisPage = ({
  students,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <main className='px-2 pt-2 min-h-[90vh]'>
      <Card className='min-h-[88vh]'>
        <CardHeader>
          <p className='uppercase text-center w-full md:text-[36px] font-bold'>
            Results Analysis
          </p>
        </CardHeader>
        <CardBody className='p-2 md:p-5'>
          <div className='flex flex-col gap-10'>
            <BestSixSubjects students={students} />
            <SubjectsPassed students={students} />
            <TotalGradeBySubject />
          </div>
        </CardBody>
      </Card>
    </main>
  )
}

export default ResultsAnalysisPage
