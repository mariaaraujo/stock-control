import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Table } from '../components/Table'
import { ButtonCustomized } from '../components/ButtonCustomized'

export default async function Home() {
  const isAuthenticated = cookies().get('stock-userId')

  if (!isAuthenticated) {
    redirect('/login')
  }

  const productHeaders = ['ID', 'Nome', 'Preço', 'Data']
  const productRows = [
    { ID: '23123', Nome: 'Uva', Preço: 279.08, Data: '2024-03-25' },
    { ID: '3213123', Nome: 'Abacate', Preço: 29.08, Data: '2024-02-14' },
  ]

  return (
    <>
      <div className="w-full flex pt-10 pl-8 lg:pt-5 lg:pl-10 justify-between">
        <h1 className="text-2xl">Lista de Produtos</h1>
        <ButtonCustomized title="Adicionar Produto" type="product" />
      </div>

      <Table headers={productHeaders} rows={productRows} api="product" />
    </>
  )
}
