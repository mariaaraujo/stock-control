'use client'

import { Card, Typography } from '@material-tailwind/react'
import { Edit, Pencil, Trash } from 'lucide-react'
import { useState } from 'react'
import { AddProduct } from '../ButtonCustomized/components/AddProduct'
import { DeleteModal } from '../DeleteModal'
import { AddUser } from '../ButtonCustomized/components/AddUser'

interface TableProps {
  headers: string[]
  rows: any
  api: string
  userId: string
  refresh(): Promise<void>
}

export function Table({ headers, rows, api, refresh, userId }: TableProps) {
  const [openEditModal, setOpenEditModal] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [itemId, setItemId] = useState('')

  const renderCell = (data: any, type: string, index: number) => {
    if (type === 'ID') {
      return null
    }
    const isLast = index === rows.length - 1
    const classes = isLast ? 'py-4' : 'py-4 border-b border-blue-gray-50'

    return (
      <td key={type} className={classes}>
        <Typography
          placeholder=""
          variant="small"
          color="blue-gray"
          className="font-normal"
        >
          {data}
        </Typography>
      </td>
    )
  }

  return (
    <>
      <Card placeholder="" className="p-10 w-full overflow-auto">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {headers.map((head) => {
                if (head === 'ID') {
                  return null
                }
                return (
                  <th
                    key={head}
                    className="border-b border-blue-gray-100 bg-blue-gray-50 py-4"
                  >
                    <Typography
                      placeholder=""
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none opacity-70"
                    >
                      {head}
                    </Typography>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map((rowData: any, index: number) => {
              return (
                <tr key={index}>
                  {headers.map((header, idx) =>
                    renderCell(rowData[header], header, idx),
                  )}
                  <td className="py-4 flex items-center gap-2 justify-center border-b border-blue-gray-50">
                    <Typography
                      placeholder=""
                      as="button"
                      onClick={() => {
                        setItemId(rowData['ID'])
                        setOpenEditModal(true)
                      }}
                      variant="small"
                      color="blue"
                    >
                      <Pencil />
                    </Typography>
                    <Typography
                      placeholder=""
                      as="button"
                      onClick={() => {
                        setItemId(rowData['ID'])
                        setOpenDeleteModal(true)
                      }}
                      variant="small"
                      color="red"
                    >
                      <Trash />
                    </Typography>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </Card>

      <DeleteModal
        setOpenModal={setOpenDeleteModal}
        openModal={openDeleteModal}
        refresh={refresh}
        api={api}
        itemId={itemId}
      />

      {api == 'product' ? (
        <AddProduct
          setOpenModal={setOpenEditModal}
          openModal={openEditModal}
          productId={itemId}
          setProductId={setItemId}
          userId={userId}
          refresh={refresh}
        />
      ) : (
        <AddUser
          setOpenModal={setOpenEditModal}
          openModal={openEditModal}
          userId={itemId}
          setUserId={setItemId}
          refresh={refresh}
        />
      )}
    </>
  )
}
