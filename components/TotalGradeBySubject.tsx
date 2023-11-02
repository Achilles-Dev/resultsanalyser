import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react'

const TotalGradeBySubject = () => {
  return (
    <div>
      <Table>
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
            <div className='flex flex-col py-2 items-center min-w-[70px] px-2'>
              <p>Total No. Absent</p>
              <div className='flex w-full pt-2 text-center'>
                <p className='w-[50%] border-e-2'>M</p>
                <p className='w-[50%]'>F</p>
              </div>
            </div>
          </TableColumn>
          <TableColumn key='cancelled' className='!px-0 border-x-1'>
            <div className='flex flex-col py-2 items-center min-w-[70px] px-2'>
              <p>Total No. Cancelled</p>
              <div className='flex w-full pt-2 text-center'>
                <p className='w-[50%] border-e-2'>M</p>
                <p className='w-[50%]'>F</p>
              </div>
            </div>
          </TableColumn>
          <TableColumn key='withheld' className='!px-0 border-x-1'>
            <div className='flex flex-col py-2 items-center min-w-[70px] px-2'>
              <p>Results WithHeld</p>
              <div className='flex w-full pt-2 text-center'>
                <p className='w-[50%] border-e-2'>M</p>
                <p className='w-[50%]'>F</p>
              </div>
            </div>
          </TableColumn>
          <TableColumn key='a1' className='!px-0 border-x-1'>
            <div className='flex flex-col py-2 items-center min-w-[70px] px-2'>
              <p>A1</p>
              <div className='flex w-full pt-2 text-center'>
                <p className='w-[50%] border-e-2'>M</p>
                <p className='w-[50%]'>F</p>
              </div>
            </div>
          </TableColumn>
          <TableColumn key='b2' className='!px-0 border-x-1'>
            <div className='flex flex-col py-2 items-center min-w-[70px] px-2'>
              <p>B2</p>
              <div className='flex w-full pt-2 text-center'>
                <p className='w-[50%] border-e-2'>M</p>
                <p className='w-[50%]'>F</p>
              </div>
            </div>
          </TableColumn>
          <TableColumn key='b3' className='!px-0 border-x-1'>
            <div className='flex flex-col py-2 items-center min-w-[70px] px-2'>
              <p>B3</p>
              <div className='flex w-full pt-2 text-center'>
                <p className='w-[50%] border-e-2'>M</p>
                <p className='w-[50%]'>F</p>
              </div>
            </div>
          </TableColumn>
          <TableColumn key='c4' className='!px-0 border-x-1'>
            <div className='flex flex-col py-2 items-center min-w-[70px] px-2'>
              <p>C4</p>
              <div className='flex w-full pt-2 text-center'>
                <p className='w-[50%] border-e-2'>M</p>
                <p className='w-[50%]'>F</p>
              </div>
            </div>
          </TableColumn>
          <TableColumn key='c5' className='!px-0 border-x-1'>
            <div className='flex flex-col py-2 items-center min-w-[70px] px-2'>
              <p>C5</p>
              <div className='flex w-full pt-2 text-center'>
                <p className='w-[50%] border-e-2'>M</p>
                <p className='w-[50%]'>F</p>
              </div>
            </div>
          </TableColumn>
          <TableColumn key='c6' className='!px-0 border-x-1'>
            <div className='flex flex-col py-2 items-center min-w-[70px] px-2'>
              <p>C6</p>
              <div className='flex w-full pt-2 text-center'>
                <p className='w-[50%] border-e-2'>M</p>
                <p className='w-[50%]'>F</p>
              </div>
            </div>
          </TableColumn>
          <TableColumn key='d7' className='!px-0 border-x-1'>
            <div className='flex flex-col py-2 items-center min-w-[70px] px-2'>
              <p>D7</p>
              <div className='flex w-full pt-2 text-center'>
                <p className='w-[50%] border-e-2'>M</p>
                <p className='w-[50%]'>F</p>
              </div>
            </div>
          </TableColumn>
          <TableColumn key='e8' className='!px-0 border-x-1'>
            <div className='flex flex-col py-2 items-center min-w-[70px] px-2'>
              <p>E8</p>
              <div className='flex w-full pt-2 text-center'>
                <p className='w-[50%] border-e-2'>M</p>
                <p className='w-[50%]'>F</p>
              </div>
            </div>
          </TableColumn>
          <TableColumn key='f9' className='!px-0 border-x-1'>
            <div className='flex flex-col py-2 items-center min-w-[70px] px-2'>
              <p>F9</p>
              <div className='flex w-full pt-2 text-center'>
                <p className='w-[50%] border-e-2'>M</p>
                <p className='w-[50%]'>F</p>
              </div>
            </div>
          </TableColumn>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>1</TableCell>
            <TableCell>English Language</TableCell>
            <TableCell>
              <div className='flex w-full pt-2 text-center'>
                <p className='w-[50%] border-e-2'>1</p>
                <p className='w-[50%]'>2</p>
              </div>
            </TableCell>
            <TableCell>
              <div className='flex w-full pt-2 text-center'>
                <p className='w-[50%] border-e-2'>1</p>
                <p className='w-[50%]'>2</p>
              </div>
            </TableCell>
            <TableCell>
              <div className='flex w-full pt-2 text-center'>
                <p className='w-[50%] border-e-2'>1</p>
                <p className='w-[50%]'>2</p>
              </div>
            </TableCell>
            <TableCell>
              <div className='flex w-full pt-2 text-center'>
                <p className='w-[50%] border-e-2'>1</p>
                <p className='w-[50%]'>2</p>
              </div>
            </TableCell>
            <TableCell>
              <div className='flex w-full pt-2 text-center'>
                <p className='w-[50%] border-e-2'>1</p>
                <p className='w-[50%]'>2</p>
              </div>
            </TableCell>
            <TableCell>
              <div className='flex w-full pt-2 text-center'>
                <p className='w-[50%] border-e-2'>1</p>
                <p className='w-[50%]'>2</p>
              </div>
            </TableCell>
            <TableCell>
              <div className='flex w-full pt-2 text-center'>
                <p className='w-[50%] border-e-2'>1</p>
                <p className='w-[50%]'>2</p>
              </div>
            </TableCell>
            <TableCell>
              <div className='flex w-full pt-2 text-center'>
                <p className='w-[50%] border-e-2'>1</p>
                <p className='w-[50%]'>2</p>
              </div>
            </TableCell>
            <TableCell>
              <div className='flex w-full pt-2 text-center'>
                <p className='w-[50%] border-e-2'>1</p>
                <p className='w-[50%]'>2</p>
              </div>
            </TableCell>
            <TableCell>
              <div className='flex w-full pt-2 text-center'>
                <p className='w-[50%] border-e-2'>1</p>
                <p className='w-[50%]'>2</p>
              </div>
            </TableCell>
            <TableCell>
              <div className='flex w-full pt-2 text-center'>
                <p className='w-[50%] border-e-2'>1</p>
                <p className='w-[50%]'>2</p>
              </div>
            </TableCell>
            <TableCell>
              <div className='flex w-full pt-2 text-center'>
                <p className='w-[50%] border-e-2'>1</p>
                <p className='w-[50%]'>2</p>
              </div>
            </TableCell>
            <TableCell>
              <div className='flex w-full pt-2 text-center'>
                <p className='w-[50%] border-e-2'>1</p>
                <p className='w-[50%]'>2</p>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}

export default TotalGradeBySubject
