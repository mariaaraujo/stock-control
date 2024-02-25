import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
// import { Header } from './components'

export default async function Home() {
  const isAuthenticated = cookies().get('stock-userId')

  if (!isAuthenticated) {
    redirect('/login')
  }

  const userRole = cookies().get('stock-userRole')?.value
  const userName = cookies().get('stock-userName')?.value

  return (
    <div className="w-full flex pt-10 pl-8 lg:pt-5 lg:pl-20">
      <h1 className="text-2xl">Lista de Produtos</h1>
    </div>
  )
}
