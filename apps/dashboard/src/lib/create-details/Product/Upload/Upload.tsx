'use client'

import { UploadIcon, XIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CldUploadWidget, CloudinaryUploadWidgetInfo } from 'next-cloudinary'
import { useState } from 'react'
import Image from 'next/image'

export const UploadImage = () => {
  const [resource, setResource] = useState<string | CloudinaryUploadWidgetInfo | undefined>(
    undefined
  )

  return (
    <div className='p-6 my-6 bg-white rounded-xl shadow-md flex items-center space-x-4'>
      <div className='flex flex-col'>
        {
          resource && 'url' in (resource as CloudinaryUploadWidgetInfo) && (
            <Image
              src={(resource as CloudinaryUploadWidgetInfo).secure_url}
              alt={(resource as CloudinaryUploadWidgetInfo).original_filename}
              width={500}
              height={500}
            />
          )
        }
        <div className='text-xl font-medium text-black'>Upload product images or similar</div>
        <p className='text-gray-500'>Support: .png, .jpg files</p>
        <div className='mt-4 flex items-center space-x-4'>
          <CldUploadWidget
            options={{ sources: ['local'], maxFiles: 1 }}
            signatureEndpoint='/dashboard/api/sign-cloudinary-params'
            onSuccess={(result, { widget }) => {
              setResource(result.info)
              widget.close()
            }}>
            {({ open }) => {
              function handleOnClick() {
                setResource(undefined)
                open()
              }

              return (
                <Button size='sm' variant='outline' onClick={handleOnClick}>
                  <UploadIcon className='mr-2 h-4 w-4' />
                  Upload
                </Button>
              )
            }}
          </CldUploadWidget>
          <Button onClick={() => setResource(undefined)} size='sm' variant='outline'>
            <XIcon className='mr-2 h-4 w-4' />
            Remove
          </Button>
        </div>
      </div>
    </div>
  )
}

