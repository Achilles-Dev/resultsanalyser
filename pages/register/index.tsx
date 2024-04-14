import Image from 'next/image'
import IndexImage from '@/public/images/illustration.svg'
import { Button, Card, CardBody, CardHeader, Input } from '@nextui-org/react'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { addUser } from '@/libs/api'
import { useState } from 'react'
import { useRouter } from 'next/router'

interface RegisterFormProps {
  email: string
  password: string
}

const Register = () => {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const registerSchema = yup.object().shape({
    email: yup.string().required('Email is required'),
    password: yup.string().required('Password is required'),
    pass_confirm: yup
      .string()
      .required('Confirm password')
      .oneOf([yup.ref('password')], 'Passwords do not match'),
  })

  const { register, handleSubmit, formState, setError } = useForm({
    reValidateMode: 'onBlur',
    resolver: yupResolver(registerSchema),
  })

  const { errors } = formState

  const onSubmit = async (data: RegisterFormProps) => {
    setLoading(true)
    const result = await addUser({ email: data.email, password: data.password })
    setLoading(false)
    if (result.message) {
      setError("email", { type: 'custom', message: 'Sorry! Email address is already in use' })
    } else {
      router.push('/')
    }
  }

  return (
    <main className='md:grid md:grid-cols-12 md:gap-2 flex flex-col h-screen'>
      <div className='md:col-span-7 w-full flex justify-center items-center'>
        <Image src={IndexImage} alt='Index Image' />
      </div>
      <div className='md:col-span-5 w-full md:flex px-2 md:items-center pb-5'>
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
              onSubmit={handleSubmit(onSubmit)}
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
              <Input
                type='password'
                {...register('pass_confirm')}
                placeholder='Confirm Password'
                className='p-2'
              />
              <span className='px-2 text-danger'>
                {errors.pass_confirm?.message}
              </span>
              <div>
                <Button type='submit' isLoading={loading} className='bg-primary text-white'>
                  Register
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </main>
  )
}

export default Register
