'use client'

import { Button, Input } from '@material-tailwind/react'
import Link from 'next/link'
import { LoginFormType, LoginFormSchema } from './form'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

export function LoginForm() {
  const {
    register,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormType>({
    resolver: yupResolver(LoginFormSchema),
  })

  async function onSubmit(data: LoginFormType) {
    console.log('data: ', data)
    try {
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="bg-white w-3/4 lg:w-1/4 h-[60%] flex flex-col gap-6 items-center justify-center rounded-lg">
      <h1 className="text-3xl text-gray-900">Login</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <Input
          crossOrigin=""
          color="gray"
          label="Login"
          {...register('login')}
        />
        <div className="-mt-3 text-red-700 text-xs">
          {errors.login?.message ?? ''}
        </div>
        <Input
          crossOrigin=""
          color="gray"
          label="Senha"
          type="password"
          {...register('password')}
        />
        <div className="-mt-3 text-red-700 text-xs">
          {errors.password?.message ?? ''}
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
      <p className="text-sm text-gray-500">
        Cria novo usuário?
        <Link
          className="text-gray-900"
          href="#"
          onClick={(e) => e.preventDefault()}
        >
          {' '}
          Clique aqui
        </Link>
      </p>
    </div>
  )
}
