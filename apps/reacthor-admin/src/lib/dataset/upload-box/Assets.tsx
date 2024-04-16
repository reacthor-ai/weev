import { TrashIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

type AssetsProps = {
  title: string
  onDelete?: any
}

export default function AssetsList({ onDelete, title }: AssetsProps) {
  return (
    <>
      <div className="flex flex-row-reverse items-center justify-center border border-gray-200 mt-5 w-[100%] rounded-md py-1 sm:px-6">
        <div className='ml-5'>
          <Button
            onClick={onDelete}
            className="h-6 w-6 rounded-full"
            size="icon"
            variant="ghost"
          >
            <TrashIcon className="w-4 h-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
        <div>
          <p className="text-white">
            {title}
          </p>
        </div>
      </div>
    </>
  )
}
