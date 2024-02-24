import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function Home() {
  const isAuthenticated = cookies().get('stock-userId')

  if (!isAuthenticated) {
    redirect('/login')
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <p>testeee</p>
    </div>
  )
}
