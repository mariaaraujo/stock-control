'use client'

import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Input,
} from '@material-tailwind/react'

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import { ProductFormSchema, ProductFormType, setProducts } from './form'
import { Loading } from '../../../Loading'
import axios from 'axios'
import { handleChangeCurrency, handleNumericChange } from '@/utils'
import { Product, ProductDTO } from '@/dtos'

interface NormalizedValues {
  userId: string
  price: number
  name: string
  quantity: number
}

interface AddProductProps {
  openModal: boolean
  setOpenModal: Dispatch<SetStateAction<boolean>>
  setProductId?: Dispatch<SetStateAction<string>>
  productId?: string
  userId: string
  refresh(): Promise<void>
}
export function AddProduct({
  openModal,
  setOpenModal,
  productId,
  setProductId,
  userId,
  refresh,
}: AddProductProps) {
  const [showLoading, setShowLoading] = useState(false)

  const {
    register,
    reset,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProductFormType>({
    resolver: yupResolver(ProductFormSchema),
  })

  async function getProductById() {
    setShowLoading(true)
    try {
      const { data, status } = await axios.get(
        `/api/product/getById?productId=${productId}`,
      )
      if (status == 200) {
        setProducts(data, setValue)
      }
      setShowLoading(false)
    } catch (error) {
      setShowLoading(false)
      console.error(error)
    }
  }

  async function createProduct(values: NormalizedValues) {
    try {
      const { status } = await axios.post('/api/product/create', values)

      if (status == 200) {
        refresh()
        setOpenModal(false)
        reset()
      }

      setShowLoading(false)
    } catch (error) {
      setShowLoading(false)
      console.error(error)
    }
  }

  async function updateProduct(values: NormalizedValues) {
    setShowLoading(true)
    try {
      const { status } = await axios.patch(
        `/api/product/update?productId=${productId}`,
        values,
      )
      if (status == 200) {
        reset()
        refresh()
        setProductId && setProductId('')
        setOpenModal(false)
      }

      setShowLoading(false)
    } catch (error) {
      setShowLoading(false)
      console.error(error)
    }
  }

  async function onSubmit(values: ProductFormType) {
    setShowLoading(true)
    try {
      const nomalizedValues = {
        ...values,
        price: Number(
          values.price.replace('R$', '').replace(' ', '').replace(',', '.'),
        ),
        userId,
      }

      if (productId) {
        await updateProduct(nomalizedValues)
      } else {
        await createProduct(nomalizedValues)
      }
      setShowLoading(false)
    } catch (error) {
      setShowLoading(false)
      console.error(error)
    }
  }

  useEffect(() => {
    if (productId) {
      ;(async () => {
        getProductById()
      })()
    }
  }, [productId])

  return (
    <>
      {showLoading && <Loading />}

      <Dialog placeholder="" open={openModal} handler={setOpenModal}>
        <DialogHeader placeholder="">
          {productId ? 'Editar' : 'Adicionar'} Produto
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogBody className="flex flex-col gap-4" placeholder="">
            <Input
              crossOrigin=""
              color="gray"
              label="Nome"
              {...register('name')}
            />
            <div className="-mt-3 text-red-700 text-xs">
              {errors.name?.message ?? ''}
            </div>
            <Input
              crossOrigin=""
              color="gray"
              label="Preço"
              {...register('price', {
                onChange: (e: any) =>
                  handleChangeCurrency(e, 'price', setValue),
              })}
            />
            <div className="-mt-3 text-red-700 text-xs">
              {errors.price?.message ?? ''}
            </div>
            <Input
              crossOrigin=""
              color="gray"
              label="Quantidade"
              {...register('quantity', {
                onChange: (e: any) =>
                  handleNumericChange(e, 'quantity', setValue),
              })}
            />
            <div className="-mt-3 text-red-700 text-xs">
              {errors.quantity?.message ?? ''}
            </div>
          </DialogBody>
          <DialogFooter placeholder="">
            <Button
              placeholder=""
              variant="text"
              color="red"
              onClick={() => {
                reset()
                setOpenModal(false)
              }}
              className="mr-1"
            >
              <span>Cancelar</span>
            </Button>
            <Button
              type="submit"
              placeholder=""
              variant="gradient"
              color="green"
            >
              <span>{productId ? 'Editar' : 'Adicionar'}</span>
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </>
  )
}
