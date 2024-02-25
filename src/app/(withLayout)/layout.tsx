import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../index.css'
import { Header } from '../components'
import { cookies } from 'next/headers'
import { ThemeProvider } from '@material-tailwind/react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Controle de Estoque',
  description: 'Aplicação para controle de estoque',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const userRole = cookies().get('stock-userRole')?.value
  const userName = cookies().get('stock-userName')?.value

  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <div className="flex items-center justify-center h-screen bg-gray-600">
          <div className="w-[95%] lg:w-[98%] h-[95%] bg-white rounded-lg overflow-auto">
            <div className="w-full flex justify-end pt-5 pr-8 lg:pr-20">
              <Header userName={userName!} userRole={userRole!} />
            </div>
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}
