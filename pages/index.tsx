import Image from 'next/image'
import IndexImage from '@/public/images/illustration.svg'
import { Button, Card, CardBody, CardHeader, Input } from '@nextui-org/react'

export default function Home() {
  return (
    <main className='grid grid-cols-12 gap-2 min-h-screen'>
      <div className='col-span-7 w-full flex justify-center items-center '>
        <Image src={IndexImage} alt='Index Image' />
      </div>
      <div className='col-span-5 w-full flex px-2 items-center'>
        <Card className='w-full'>
          <CardHeader>
            <div className='flex flex-col gap-3 items-center w-full'>
              <p className='text-primary text-[36px]'>Results Analyser</p>
              <p className='text-primary text-[20px]'>Welcome!</p>
            </div>
          </CardHeader>
          <CardBody>
            <form
              className='flex flex-col gap-3'
              onSubmit={(event) => {
                event.preventDefault()
              }}
            >
              <Input type='email' placeholder='Email address' className='p-2' />
              <Input type='password' placeholder='Password' className='p-2' />
              <div>
                <Button type='submit' className='bg-primary text-white'>
                  Login
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </main>
  )
}
