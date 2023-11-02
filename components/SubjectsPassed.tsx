import {
  Table,
  TableBody,
  TableHeader,
  TableColumn,
  TableRow,
  TableCell,
} from '@nextui-org/react'

const SubjectsPassed = () => {
  return (
    <div>
      <Table aria-label='Subject passed table'>
        <TableHeader>
          <TableColumn key='item'>
            <div className='flex flex-col py-2'>
              <p>Name Of School</p>
            </div>
          </TableColumn>
          <TableColumn key='Male'>
            <div className='flex flex-col border-b-1 py-2'>
              <p className='pt-2'>Total number of subjects passed</p>
              <div className='flex w-full mt-2'>
                {Array(9)
                  .fill(0)
                  .map((_, index) => {
                    let item = 8 - index
                    return (
                      <div className='w-[11.11%] px-1 border-x-1 text-center flex flex-col'>
                        <p className='pt-2'>{item}</p>
                        <div className='flex w-full pt-2'>
                          <p className='w-[50%] border-e-2'>M</p>
                          <p className='w-[50%]'>F</p>
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
            <TableCell>1</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}

export default SubjectsPassed
