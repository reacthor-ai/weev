'use client'

import { ChangeEvent, useRef, useState } from 'react'
import { UploadIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Assets from '@/lib/create-details/BrandIdentity/Upload/Assets'
import { Separator } from '@/components/ui/separator'

const FILES_ALLOWED = ['.docs', '.pdf', '.txt']

export const UploadFiles = () => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [files, setFiles] = useState<File[]>([])

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files)
      setFiles(prevFiles => [...prevFiles, ...newFiles])
    }
  }

  const handleTriggerFileInputClick = () => {
    fileInputRef.current?.click()
  }

  /**
   * TODO: Should be uploaded using
   * Jotai separately once its ready
   */
  const handleFileUpload = async () => {
    if (files.length === 0) {
      alert('Please select files first.')
      return
    }

    const formData = new FormData()
    files.forEach(file => formData.append('files[]', file)) // 'files[]' to indicate multiple values for the same name

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      const data = await response.json()
      console.log('Upload successful', data)
      setFiles([]) // Optionally clear files after upload
    } catch (error) {
      console.error('Error uploading files:', error)
    }
  }

  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, idx) => idx !== index))
  }

  return (
    <div className='p-6 my-6 bg-white rounded-xl shadow-md flex flex-col space-y-4'>
      <div className='text-xl font-medium text-black'>Upload your brand Guidelines</div>
      <p className='text-gray-500'>Support: .docs, .txt, .pdf files</p>

      {/* Hidden File Input */}
      <input
        type='file'
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={FILES_ALLOWED.join(',')}
        multiple
        style={{ display: 'none' }}
      />

      <Button size='sm' variant='outline' onClick={handleTriggerFileInputClick}>
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
