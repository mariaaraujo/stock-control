'use client'

import { useState } from 'react'

import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
} from '@material-tailwind/react'
import { ChevronDownIcon, LogOut, User } from 'lucide-react'

interface HeaderProps {
  userName: string
  userRole: string
}

export function Header({ userName, userRole }: HeaderProps) {
  const [openMenu, setOpenMenu] = useState(false)

  return (
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
          <MenuItem placeholder="" className="flex items-center gap-5">
            <User />
            Usuários
          </MenuItem>
        )}
        <MenuItem placeholder="" className="flex items-center gap-5">
          <LogOut />
          Sair
        </MenuItem>
      </MenuList>
    </Menu>
  )
}
