import { Button } from '@/components/ui/button'
import { FileIcon, TrashIcon } from 'lucide-react'

type AssetsProps = {
  title: string
  onDelete: any
}

export default function Assets(params: AssetsProps) {
  const { title, onDelete } = params

  return (
    <div className='flex items-center w-full max-w-sm space-x-2'>
      <FileIcon />
      <div className='flex-1 min-w-0 text-xs truncate'>{title}</div>
      <Button onClick={onDelete} className='h-6 w-6 rounded-full' size='icon' variant='ghost'>
        <TrashIcon className='w-4 h-4' />
        <span className='sr-only'>Delete</span>
      </Button>
    </div>
  )
}
