'use client'

import { ChangeEvent, Dispatch, SetStateAction, useRef } from 'react'
import { UploadIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Assets from '@/lib/create-details/Upload/Assets'
import { Separator } from '@/components/ui/separator'

type UploadFilesProps = {
  title: string
  files: File[]
  setFiles: Dispatch<SetStateAction<File[]>>
  filesAllowed: string[]
}

export const UploadFiles = (props: UploadFilesProps) => {
  const { files, setFiles, filesAllowed, title } = props
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files)
      setFiles(prevFiles => [...prevFiles, ...newFiles])
    }
  }

  const handleTriggerFileInputClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, idx) => idx !== index))
  }

  return (
    <div className='p-6 my-6 bg-white rounded-xl shadow-md flex flex-col space-y-4'>
      <div className='text-xl font-medium text-black'>{title}</div>
      <p className='text-gray-500'>{`Support: ${filesAllowed.map(d => ` ${d}`)} files`}</p>

      {/* Hidden File Input */}
      <input
        type='file'
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={filesAllowed.join(',')}
        multiple
        style={{ display: 'none' }}
      />

      <Button disabled={files.length >= 1} size='sm' variant='outline' onClick={handleTriggerFileInputClick}>
        <UploadIcon className='mr-2 h-4 w-4' />
        Select Files
      </Button>

      {files.length > 0 && (
        <div className='grid grid-rows-1 gap-3'>
          {files.map((file, index) => (
            <div key={file.name}>
              <div key={index} className='flex pb-5 justify-between items-center'>
                <Assets title={file.name} onDelete={() => handleRemoveFile(index)} />
              </div>
              <Separator />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
