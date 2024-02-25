'use client'

import { useEffect, useState } from 'react'

import { Loading } from '@/app/components'
import { Table } from '@/app/components/Table'
import { ButtonCustomized } from '@/app/components/ButtonCustomized'
import axios from 'axios'
import { ProductResponse } from '@/dtos'

interface ProductContainerProps {
  isAuthenticated: string
}

export function ProductContainer({ isAuthenticated }: ProductContainerProps) {
  const productHeaders = ['ID', 'Nome', 'Preço', 'Quantidade', 'Data']
  const [showLoading, setShowLoading] = useState(true)
  const [products, setProducts] = useState<ProductResponse[]>([])

  async function getProducts() {
    try {
      const { data, status } = await axios.get('/api/product/get')
      if (status === 200) {
        setProducts(
          data?.message?.products?.map((item: ProductResponse) => {
            return {
              ID: item.id,
              Nome: item.name,
              Preço: `R$ ${item.price.toFixed(2).toString().replace('.', ',')}`,
              Quantidade: item.quantity,
              Data: new Date(item.createdAt).toLocaleDateString('pt-BR'),
            }
          }),
        )
        setShowLoading(false)
      }
    } catch (error) {
      setShowLoading(false)
      console.error(error)
    }
  }

  useEffect(() => {
    getProducts()
  }, [])

  return (
    <>
      {showLoading && <Loading />}
      <div className="w-full flex pt-10 pl-8 lg:pt-5 lg:pl-10 justify-between">
        <h1 className="text-2xl">Lista de Produtos</h1>
        <ButtonCustomized
          userId={isAuthenticated}
          title="Adicionar Produto"
          type="product"
          refresh={getProducts}
        />
      </div>

      <Table
        headers={productHeaders}
        rows={products}
        api="product"
        userId={isAuthenticated}
        refresh={getProducts}
      />
    </>
  )
}
