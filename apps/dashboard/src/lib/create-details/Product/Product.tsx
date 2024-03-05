'use client'

import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { UploadImage } from './Upload'

export const ProductCreateDetails = () => {
  return (
    <div className='min-h-screen p-8'>
      <div className='bg-white rounded-lg shadow-lg overflow-hidden'>
        <div className='grid grid-cols-2  mb-8'>
          <div className='border-r border-gray-200 p-8 space-y-6'>
            <h1 className='text-2xl font-bold'>New Product</h1>
            <div className='space-y-4'>
              <div className='mb-6'>
                <label className='block text-sm font-medium text-gray-700' htmlFor='product-name'>
                  Choose your Brand Identity *
                </label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder='Brand Identities' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Fruits</SelectLabel>
                      <SelectItem value='apple'>Apple</SelectItem>
                      <SelectItem value='banana'>Banana</SelectItem>
                      <SelectItem value='blueberry'>Blueberry</SelectItem>
                      <SelectItem value='grapes'>Grapes</SelectItem>
                      <SelectItem value='pineapple'>Pineapple</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className='mb-4 block text-sm font-medium text-gray-700' htmlFor='product-attributes'>
                  Copywriting brief for new product *
                </label>
                <Textarea
                  className='h-[360px]'
                  placeholder='Write your copywriting brief'
                />
              </div>
            </div>
            <Button className='bg-blue-600 text-white w-full'>Generate content</Button>
          </div>
          <div className='p-8 space-y-4'>
            <div className='flex flex-col justify-between'>
              <h2 className='text-xl font-semibold'>Add Image</h2>
              <div>
                <UploadImage />
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
          </div>
        </div>
      </div>
    </div>
  )
}
