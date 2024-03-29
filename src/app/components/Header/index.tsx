'use client'

import { useState } from 'react'

import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
} from '@material-tailwind/react'
import { ChevronDownIcon, LogOut, ShoppingCart, User } from 'lucide-react'
import { redirect, useRouter } from 'next/navigation'
import Link from 'next/link'
import { destroyCookieClientSide } from '@/utils'
import { Loading } from '../Loading'

interface HeaderProps {
  userName: string
  userRole: string
}

export function Header({ userName, userRole }: HeaderProps) {
  const [openMenu, setOpenMenu] = useState(false)
  const [showLoading, setShowLoading] = useState(false)
  const router = useRouter()

  async function handleLogout() {
    setShowLoading(true)
    destroyCookieClientSide('stock-userId')
    destroyCookieClientSide('stock-userName')
    destroyCookieClientSide('stock-userRole')

    await router.push('/login')
  }

  return (
    <>
      {showLoading && <Loading />}
      <Menu open={openMenu} handler={setOpenMenu} allowHover>
        <MenuHandler>
          <Button
            placeholder=""
            variant="text"
            className="flex items-center gap-3 text-base font-normal capitalize tracking-normal"
          >
            Olá, {userName}
            <ChevronDownIcon
              strokeWidth={2.5}
              className={`h-3.5 w-3.5 transition-transform ${
                openMenu ? 'rotate-180' : ''
              }`}
            />
          </Button>
        </MenuHandler>
        <MenuList placeholder="">
          {userRole === 'ADMIN' && (
            <>
              <Link href="/">
                <MenuItem placeholder="" className="flex items-center gap-5">
                  <ShoppingCart />
                  Produtos
                </MenuItem>
              </Link>
              <Link href="/usuarios">
                <MenuItem placeholder="" className="flex items-center gap-5">
                  <User />
                  Usuários
                </MenuItem>
              </Link>
            </>
          )}
          <MenuItem
            placeholder=""
            className="flex items-center gap-5"
            onClick={() => handleLogout()}
          >
            <LogOut />
            Sair
          </MenuItem>
        </MenuList>
      </Menu>
    </>
  )
}
