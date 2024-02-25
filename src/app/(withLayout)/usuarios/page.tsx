import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { UserContainer } from './components/UserContainer'

export default async function Users() {
  const isAuthenticated = cookies().get('stock-userId')

  if (!isAuthenticated) {
    redirect('/login')
  }

  return <UserContainer isAuthenticated={isAuthenticated?.value} />
}
