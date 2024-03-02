import { UploadIcon, XIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const UploadFiles = () => {
  return (
    <div className='p-6 my-6 bg-white rounded-xl shadow-md flex items-center space-x-4'>
      <div className='flex flex-col'>
        <div className='text-xl font-medium text-black'>Upload your brand Guidelines</div>
        <p className='text-gray-500'>Support: .docs, .txt, .pdf files</p>
        <div className='mt-4 flex items-center space-x-4'>
          <Button size='sm' variant='outline'>
            <UploadIcon className='mr-2 h-4 w-4' />
            Upload
          </Button>
          <Button size='sm' variant='outline'>
            <XIcon className='mr-2 h-4 w-4' />
            Remove
          </Button>
        </div>
      </div>
    </div>
  )
}

