'use client'

import { Button } from '@material-tailwind/react'
import { useState } from 'react'
import { AddProduct } from './components/AddProduct'

interface ButtonCustomizedProps {
  title: string
  type: string
}

export function ButtonCustomized({ title, type }: ButtonCustomizedProps) {
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
        <AddProduct openModal={openModal} setOpenModal={setOpenModal} />
      ) : (
        <></>
      )}
    </>
  )
}
