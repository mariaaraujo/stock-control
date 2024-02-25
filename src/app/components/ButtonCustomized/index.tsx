'use client'

import { Button } from '@material-tailwind/react'
import { useState } from 'react'
import { AddProduct } from '../AddProduct'

interface ButtonCustomizedProps {
  title: string
}

export function ButtonCustomized({ title }: ButtonCustomizedProps) {
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

      <AddProduct openModal={openModal} setOpenModal={setOpenModal} />
    </>
  )
}
