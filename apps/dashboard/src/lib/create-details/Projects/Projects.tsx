'use client'

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

export const ProjectCreateDetails = () => {
  return (
    <div className='w-[50%] p-8'>
      <div className='bg-white rounded-lg shadow-lg overflow-hidden h-full'>
        <div className='grid grid-cols-1'>
          <div className='border-r border-gray-200 p-8 space-y-6'>
            <h1 className='text-2xl font-bold'>Product descriptions</h1>
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700' htmlFor='product-name'>
                  Project Name *
                </label>
                <Input
                  id='product-name'
                  placeholder='Please enter the title of your project'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700' htmlFor='product-attributes'>
                  Project Description *
                </label>
                <Textarea
                  placeholder='What is your project about?'
                  id='product-attributes'
                />
              </div>
            </div>
            <Button className='bg-blue-600 text-white w-full'>Create projects</Button>
          </div>

        </div>

      </div>
    </div>
  )
}
