import Image from 'next/image'
import IndexImage from '@/public/images/illustration.svg'
import { Button, Card, CardBody, CardHeader, Input } from '@nextui-org/react'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'

interface RegisterFormProps {
  username: string
  email: string
  password: string
}

const Register = () => {
  const registerSchema = yup.object().shape({
    username: yup.string().required('Username is required'),
    email: yup.string().required('Email is required'),
    password: yup.string().required('Password is required'),
    pass_confirm: yup
      .string()
      .required('Confirm password')
      .oneOf([yup.ref('password')], 'Passwords do not match'),
  })

  const { register, handleSubmit, watch, formState } = useForm({
    reValidateMode: 'onBlur',
    resolver: yupResolver(registerSchema),
  })

  const { errors } = formState

  const onSubmit = (data: RegisterFormProps) => {
    console.log(data)
  }

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
              onSubmit={handleSubmit(onSubmit)}
            >
              <Input
                type='text'
                {...register('username')}
                placeholder='Username'
                className='p-2'
              />
              <span className='px-2 text-danger'>
                {errors.username?.message}
              </span>
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
                <Button type='submit' className='bg-primary text-white'>
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
