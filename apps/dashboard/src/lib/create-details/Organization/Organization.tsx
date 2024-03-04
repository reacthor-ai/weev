'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useCreateOrganizationAtom } from '@/store'
import { useRouter } from 'next/navigation'

type OrganizationCreateDetailsProps = {
  id: string
}

export const OrganizationCreateDetails = (
  props: OrganizationCreateDetailsProps
) => {
  const { id } = props
  const [title, setTitle] = useState<string>('')
  const [{ mutate: mutateOrganization }] = useCreateOrganizationAtom()
  const router = useRouter()

  const isDisabled = title.length === 0

  const createOrganizationTitle = async () => {
    await mutateOrganization(
      {
        clerkId: id,
        title
      },
      {
        onSettled: async () => {
          router.refresh()
          setTitle('')
        }
      }
    )
  }

  return (
    <div className='w-[50%] p-8'>
      <div className='bg-white rounded-lg shadow-lg overflow-hidden h-full'>
        <div className='grid grid-cols-1'>
          <div className='border-r border-gray-200 p-8 space-y-6'>
            <h1 className='text-2xl font-bold'>Create your organization</h1>
            <div className='space-y-4'>
              <div>
                <label
                  className='block text-sm font-medium text-gray-700'
                  htmlFor='product-name'
                >
                  Organization Name *
                </label>
                <Input
                  placeholder='Please enter the organization'
                  onChange={e => setTitle(e.target.value)}
                />
              </div>
              <Button
                disabled={isDisabled}
                onClick={() => createOrganizationTitle()}
                className='bg-blue-600 text-white w-full'
              >
                Create Organization
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
