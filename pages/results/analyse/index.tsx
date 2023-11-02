import { Card, CardBody, CardHeader } from '@nextui-org/react'
import BestSixSubjects from '@/components/BestSixSubjects'
import SubjectsPassed from '@/components/SubjectsPassed'
import TotalGradeBySubject from '@/components/TotalGradeBySubject'

const ResultsAnalysisPage = () => {
  return (
    <main className='px-2 pt-2 min-h-[90vh]'>
      <Card className='min-h-[88vh]'>
        <CardHeader>
          <p className='uppercase text-center w-full md:text-[36px] font-bold'>
            Results Analysis
          </p>
        </CardHeader>
        <CardBody>
          <div className='flex flex-col gap-10'>
            <BestSixSubjects />
            <SubjectsPassed />
            <TotalGradeBySubject />
          </div>
        </CardBody>
      </Card>
    </main>
  )
}

export default ResultsAnalysisPage
