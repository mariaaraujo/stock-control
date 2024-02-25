'use client'

import { Dispatch, SetStateAction, useState } from 'react'
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Typography,
} from '@material-tailwind/react'

import axios from 'axios'
import { Loading } from '../Loading'

interface DeleteModalProps {
  openModal: boolean
  setOpenModal: Dispatch<SetStateAction<boolean>>
  api: string
  itemId: string
  refresh(): Promise<void>
}
export function DeleteModal({
  openModal,
  setOpenModal,
  itemId,
  api,
  refresh,
}: DeleteModalProps) {
  const [showLoading, setShowLoading] = useState(false)

  async function deleteItem() {
    setShowLoading(true)
    try {
      const { status } = await axios.delete(`/api/${api}/delete?id=${itemId}`)
      if (status === 200) {
        refresh()
        setShowLoading(false)
        setOpenModal(false)
      }
    } catch (error) {
      setShowLoading(false)
      console.error(error)
    }
  }

  return (
    <>
      {showLoading && <Loading />}

      <Dialog placeholder="" open={openModal} handler={setOpenModal}>
        <DialogHeader placeholder="">Remover Item</DialogHeader>

        <DialogBody className="flex flex-col gap-4" placeholder="">
          <Typography placeholder="" as="h3">
            Deseja realmente remover este item?
          </Typography>
        </DialogBody>
        <DialogFooter placeholder="">
          <Button
            placeholder=""
            variant="text"
            color="red"
            onClick={() => {
              setOpenModal(false)
            }}
            className="mr-1"
          >
            <span>Cancelar</span>
          </Button>
          <Button
            onClick={() => deleteItem()}
            placeholder=""
            variant="gradient"
            color="red"
          >
            <span>Remover</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  )
}
