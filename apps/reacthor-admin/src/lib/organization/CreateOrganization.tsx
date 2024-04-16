'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useCreateUserAtom } from '@/store/user/create'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/router'

export const CreateOrganization = () => {
  const [title, setTitle] = useState<string>('')
  const router = useRouter()
  const [{ mutate: createUser, isPending }] = useCreateUserAtom()

  return (
    <div className="w-[50%] p-8">
      <div className="bg-black text-white rounded-lg shadow-lg overflow-hidden h-full">
        <div className="grid grid-cols-1">
          <div className="p-8 space-y-6">
            <h1 className="text-2xl font-bold">Create your organization</h1>
            <div className="space-y-4">
              <div>
                <label
                  className="block text-sm font-medium pb-2"
                  htmlFor="product-name"
                >
                  Organization Name *
                </label>
                <Input
                  placeholder="Please enter the organization"
                  onChange={e => setTitle(e.target.value)}
                />
              </div>
              <Button
                disabled={isPending}
                onClick={() => createUser({ organizationTitle: title }, {
                  onSettled: () => {
                    router.reload()
                  }
                })}
                className="bg-white text-black hover:bg-black hover:text-white"
              >
                {isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Create
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
