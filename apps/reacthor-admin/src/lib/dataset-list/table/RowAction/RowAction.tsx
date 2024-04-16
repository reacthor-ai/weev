'use client'

import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Row } from '@tanstack/react-table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { useDeleteMessagingByIdAtom } from '@/store/messaging/delete'

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function RowActions<TData>({ row }: DataTableRowActionsProps<TData>) {
  const messagingId: string = row.getValue('id')

  const [{ mutate: deleteMessagingById }] = useDeleteMessagingByIdAtom()

  const removeMessageById = async (id: string) => {
    await deleteMessagingById(
      {
        messagingId: id
      },
      {
        onSettled: data => {
          if (data && data.status === 'fulfilled') {
            // reload
            window.location.reload()
          }
        }
      }
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem
          onClick={() => removeMessageById(messagingId)}
          className={'cursor-pointer'}
        >
          Delete
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
