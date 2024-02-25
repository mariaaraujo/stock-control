import { Product } from '@/dtos'
import { UseFormSetValue } from 'react-hook-form'
import * as yup from 'yup'

export type ProductFormType = {
  name: string
  price: string
  quantity: number
}

export const ProductFormSchema = yup.object({
  name: yup.string().required('O Nome é obrigatório'),
  price: yup.string().required('O Preço é obrigatório'),
  quantity: yup
    .number()
    .transform((value) => (Number.isNaN(value) ? null : value))
    .nullable()
    .required('A Quantidade é obrigatória'),
})

export const setProducts = (
  product: Product,
  setValue: UseFormSetValue<ProductFormType>,
) => {
  setValue('name', product.name)
  setValue(
    'price',
    `R$ ${product.price.toFixed(2).toString().replace('.', ',')}`,
  )
  setValue('quantity', product.quantity)
}
