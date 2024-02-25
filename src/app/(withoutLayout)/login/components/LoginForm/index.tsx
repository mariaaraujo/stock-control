'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

import axios from 'axios'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Input } from '@material-tailwind/react'

import { LoginFormType, LoginFormSchema } from './form'
import { Loading } from '@/app/components'

export function LoginForm() {
  const [showLoading, setShowLoading] = useState(false)
  const [error, setError] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormType>({
    resolver: yupResolver(LoginFormSchema),
  })

  const router = useRouter()

  async function onSubmit(values: LoginFormType) {
    setShowLoading(true)
    try {
      const { data } = await axios.post('/api/login', values)

      if (data?.status === 400) {
        setShowLoading(false)

        setError('Login ou senha incorreto')
      }

      if (data?.status === 200 && data) {
        await router.push('/')

        setShowLoading(false)
      }
    } catch (error) {
      setShowLoading(false)
      console.error(error)
    }
  }

  return (
    <>
      {showLoading && <Loading />}
      <div className="bg-white w-3/4 lg:w-1/4 h-[60%] flex flex-col gap-6 items-center justify-center rounded-lg">
        <h1 className="text-3xl text-gray-900">Login</h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <Input
            crossOrigin=""
            color="gray"
            label="Login"
            {...register('login', {
              onChange: () => setError(''),
            })}
          />
          <div className="-mt-3 text-red-700 text-xs">
            {errors.login?.message ?? ''}
          </div>
          <Input
            crossOrigin=""
            color="gray"
            label="Senha"
            type="password"
            {...register('password', {
              onChange: () => setError(''),
            })}
          />
          <div className="-mt-3 text-red-700 text-xs">
            {errors.password?.message ?? ''}
            {error ?? ''}
          </div>
          <Button
            type="submit"
            className="w-3/4 self-center"
            placeholder="Entrar"
            variant="gradient"
          >
            Entrar
          </Button>
        </form>
      </div>
    </>
  )
}
