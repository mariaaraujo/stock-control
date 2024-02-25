import * as yup from 'yup'

export type LoginFormType = {
  login: string
  password: string
}

export const LoginFormSchema = yup.object({
  login: yup.string().required('O Login é obrigatório'),
  password: yup.string().required('A Senha é obrigatória'),
})
