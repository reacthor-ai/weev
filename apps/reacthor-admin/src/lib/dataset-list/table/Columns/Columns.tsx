'use client'

import { ColumnDef } from '@tanstack/react-table'

import { LineMessages } from '@/lib/dataset-list/table/types'
import { RowActions } from '@/lib/dataset-list/table/RowAction/RowAction'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { useUpdateMessageByIdAtom } from '@/store/messaging/update'

export const columns: ColumnDef<LineMessages>[] = [
  {
    accessorKey: 'role',
    header: ({ column }) => <p>Sender type</p>,
    cell: ({ row }) => {
      return (
        <span className="max-w-[500px] truncate font-medium">
          {row.getValue('role')}
        </span>
      )
    }
  },
  {
    accessorKey: 'updatedAt',
    header: ({ column }) => <p>Updated at</p>,
    cell: ({ row }) => {
      return (
        <span className="max-w-[500px] truncate font-medium">
          Date: {new Date(row.getValue('updatedAt')).getDate()}
        </span>
      )
    }
  },
  {
    accessorKey: 'content',
    header: () => <p>Message</p>,
    cell: cellValue => {
      const [value, setValue] = useState<string>(
        cellValue.row.getValue('content')
      )
      const [{ mutate: updateMessageById }] = useUpdateMessageByIdAtom()
      const handleSetValue = async () => {
        await updateMessageById(
          {
            content: value,
            messagingId: cellValue.row.getValue('id')
          },
          {
            onSettled: data => {
              console.log({ data })
            }
          }
        )
      }

      return (
        <span className="max-w-[500px] truncate font-medium">
          <Input
            id="title"
            placeholder={'Name your Dataset'}
            className="col-span-8"
            value={value}
            onChange={e => setValue(e.target.value)}
            onBlur={handleSetValue}
          />
        </span>
      )
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <RowActions row={row} />
  },
  {
    accessorKey: 'id',
    header: () => 'Id',
    footer: props => props.column.id
  }
]
