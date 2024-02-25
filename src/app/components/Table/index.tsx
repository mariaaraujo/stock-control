'use client'

import { Card, Typography } from '@material-tailwind/react'
import { Edit, Pencil, Trash } from 'lucide-react'
import { useState } from 'react'
import { AddProduct } from '../AddProduct'

interface TableProps {
  headers: string[]
  rows: any
  api: string
}

export function Table({ headers, rows, api }: TableProps) {
  const [openEditModal, setOpenEditModal] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [itemId, setItemId] = useState('')

  const renderCell = (data: any, type: string, index: number) => {
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
          {typeof data === 'number' ? `R$ ${data.toFixed(2)}` : data}
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
              {headers.map((head) => (
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
              ))}
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
                      onClick={() => setOpenDeleteModal(true)}
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
      {api == 'product' ? (
        <AddProduct
          setOpenModal={setOpenEditModal}
          openModal={openEditModal}
          productId={itemId}
        />
      ) : (
        <></>
      )}
    </>
  )
}
