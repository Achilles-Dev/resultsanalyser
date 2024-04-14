import Image from 'next/image'
import IndexImage from '@/public/images/illustration.svg'
import { Button, Card, CardBody, CardHeader, Input } from '@nextui-org/react'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
// import { initDb } from '@/libs/api'

// initDb()
interface LoginFormProps {
  email: string
  password: string
}

export default function Home() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const loginSchema = yup.object().shape({
    email: yup.string().required('Email is required'),
    password: yup.string().required('Password is required'),
  })

  const { register, handleSubmit, formState } = useForm({
    reValidateMode: 'onBlur',
    resolver: yupResolver(loginSchema),
  })

  const { errors } = formState

  const handleLogin = async (data: LoginFormProps) => {
    setLoading(true)
    const email = data.email
    const password = data.password
    await signIn('credentials', {
      redirect: false,
      email,
      password,
    })
    setLoading(false)
    router.push('/dashboard')
  }

  return (
    <main className='md:grid md:grid-cols-12 md:gap-2 flex flex-col gap-10 h-screen'>
      <div className='md:col-span-7 w-full flex justify-center items-center h-[50%] md:h-full'>
        <Image src={IndexImage} alt='Index Image' />
      </div>
      <div className='md:col-span-5 w-full md:flex px-2 md:items-center h-[50%] md:h-full pb-2'>
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
              onSubmit={handleSubmit(handleLogin)}
            >
              <Input
                type='email'
                {...register('email')}
                placeholder='Email address'
                className='p-2'
              />
              <span className='px-2 text-danger'>{errors.email?.message}</span>
              <Input
                type='password'
                {...register('password')}
                placeholder='Password'
                className='p-2'
              />
              <span className='px-2 text-danger'>
                {errors.password?.message}
              </span>
              <div>
                <Button
                  type='submit'
                  className='bg-primary text-white'
                  isLoading={loading}
                >
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
