import { Card, CardHeader } from '@nextui-org/react'
import { useState } from 'react'

const Results = () => {
  const [year, setYear] = useState<string>('')
  return (
    <main className='px-2 pt-2'>
      <Card className='min-h-[89vh] px-2'>
        <CardHeader className='border-b-1 py-2'>
          <p className='uppercase text-center w-full md:text-[36px] font-bold'>
            Student Results {year ? `(${year}/${year + 1})` : ''}
          </p>
        </CardHeader>
      </Card>
    </main>
  )
}

export default Results
