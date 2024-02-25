'use client'

import { Button } from '@material-tailwind/react'
import { useState } from 'react'
import { AddProduct } from './components/AddProduct'
import { AddUser } from './components/AddUser'

interface ButtonCustomizedProps {
  title: string
  type: string
  userId: string
  refresh(): Promise<void>
}

export function ButtonCustomized({
  title,
  type,
  userId,
  refresh,
}: ButtonCustomizedProps) {
  const [openModal, setOpenModal] = useState(false)

  return (
    <>
      <Button
        className="mr-10"
        placeholder={title}
        onClick={() => setOpenModal(true)}
      >
        {title}
      </Button>

      {type == 'product' ? (
        <AddProduct
          openModal={openModal}
          setOpenModal={setOpenModal}
          userId={userId}
          refresh={refresh}
        />
      ) : (
        <AddUser
          openModal={openModal}
          setOpenModal={setOpenModal}
          refresh={refresh}
        />
      )}
    </>
  )
}
