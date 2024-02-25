import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { Table } from '@/app/components/Table'
import { ButtonCustomized } from '@/app/components/ButtonCustomized'

export default async function Users() {
  const isAuthenticated = cookies().get('stock-userId')

  if (!isAuthenticated) {
    redirect('/login')
  }

  const userHeaders = ['ID', 'Nome', 'Login', 'Cargo']
  const userRows = [
    { ID: '23123', Nome: 'Uva', Login: 'teste123', Cargo: 'ADMINISTRADOR' },
    { ID: '3213123', Nome: 'Abacate', Login: 'teste', Cargo: 'USUÁRIO' },
  ]

  return (
    <>
      <div className="w-full flex pt-10 pl-8 lg:pt-5 lg:pl-10 justify-between">
        <h1 className="text-2xl">Lista de Usuários</h1>
        <ButtonCustomized title="Adicionar Usuário" type="user" />
      </div>

      <Table headers={userHeaders} rows={userRows} api="user" />
    </>
  )
}
