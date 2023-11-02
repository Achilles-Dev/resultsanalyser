import {
  Table,
  TableBody,
  TableHeader,
  TableColumn,
  TableRow,
  TableCell,
} from '@nextui-org/react'

const BestSixSubjects = () => {
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
            <TableCell>Number of students</TableCell>
            <TableCell>1</TableCell>
            <TableCell>1</TableCell>
            <TableCell>2</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}

export default BestSixSubjects
