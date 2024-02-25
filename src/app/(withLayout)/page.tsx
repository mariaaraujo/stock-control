import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ProductContainer } from './components/ProductContainer'

export default async function Home() {
  const isAuthenticated = cookies().get('stock-userId')
  console.log(isAuthenticated)

  if (!isAuthenticated) {
    redirect('/login')
  }

  return <ProductContainer isAuthenticated={isAuthenticated?.value} />
}
