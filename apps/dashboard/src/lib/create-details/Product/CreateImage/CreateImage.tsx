'use client'

import { Textarea } from '@/components/ui/textarea'
import { UploadFiles } from '../../Upload'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export const CreateImageDetails = () => {
  const [files, setFiles] = useState<File[]>([])

  return (
    <div className='min-h-screen p-8'>
      <div className='bg-white rounded-lg shadow-lg overflow-hidden'>

        <div className='grid grid-cols-2'>
          <div className='p-8 space-y-4'>
            <div className='flex flex-col justify-between'>
              <h2 className='text-xl font-semibold'>Add Image</h2>
              <div>
                <UploadFiles
                  title='Upload product image or similar'
                  files={files}
                  setFiles={setFiles}
                  filesAllowed={['png', 'jpg', 'jpeg']}
                />
              </div>
              <div>
                <label className='block mb-4 text-sm font-medium text-gray-700' htmlFor='product-attributes'>
                  Imagery guidelines (Direct the prompt to the type of image)
                </label>
                <Textarea
                  className='h-[360px]'
                  placeholder='Write your imagery guidelines brief'
                />
              </div>
            </div>
            <Button className='bg-blue-600 text-white w-full'>Generate content</Button>
          </div>
          <div className='p-8 space-y-4'>
            <div className='flex flex-col justify-between'>
              <div>
                <Image
                  src={'https://cdn.leonardo.ai/users/655cab70-b1ba-4eb5-b878-3ba0ec055fc5/generations/128ec322-26f3-447e-8b92-bf5b644cb76b/variations/Default_Experience_the_perfect_blend_of_fashion_and_sustainabi_0_128ec322-26f3-447e-8b92-bf5b644cb76b_0.jpg?w=512'}
                  alt={'image logo'}
                  width={500}
                  height={500}
                  className='rounded-md'
                />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
