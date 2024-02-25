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
import { Loading } from '../Loading'
import axios from 'axios'

interface AddProductProps {
  openModal: boolean
  setOpenModal: Dispatch<SetStateAction<boolean>>
  productId?: string
}
export function AddProduct({
  openModal,
  setOpenModal,
  productId,
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
        `/api/product/getById?id=${productId}`,
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

  async function onSubmit(values: ProductFormType) {
    setShowLoading(true)
    try {
      const { data, status } = await axios.post('/api/product/create', values)

      if (status == 200) {
        setOpenModal(false)
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
  }, [])

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
              {...register('price')}
            />
            <div className="-mt-3 text-red-700 text-xs">
              {errors.price?.message ?? ''}
            </div>
            <Input
              crossOrigin=""
              color="gray"
              label="Quantidade"
              {...register('quantity')}
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
              <span>Adicionar</span>
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </>
  )
}
