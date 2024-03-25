'use client'

import { Textarea } from '@/components/ui/textarea'
import { useCallback, useState } from 'react'
import { BrandVoiceType } from '@/database'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useChat } from 'ai/react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircleIcon } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

type ProductContentProps = {
  clerkId: string
  brandVoices: BrandVoiceType[]
  organizationId: string
  userId: string
  projectId: string
  actionType: 'create-product' | 'update-product'
  productId: string | null
}

export const ProductContent = (props: ProductContentProps) => {
  const { brandVoices, projectId, actionType, productId } = props

  const [brandVoiceId, setBrandVoiceId] = useState<string>('')
  const [isProgress, setIsProgress] = useState<boolean>(false)

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  const {
    messages,
    isLoading,
    input,
    handleInputChange,
    handleSubmit,
    reload,
    setMessages
  } = useChat({
    api: '/dashboard/api/ai/retrieve-brand-voice',
    body: {
      brandVoiceId,
      type_of_completion: 'generate-product'
    }
  })

  const onSubmit = (e, c) => {
    setMessages([])
    return handleSubmit(e, c)
  }

  const isDisabled = () => {
    return input.length <= 0 || brandVoiceId.length <= 0
  }

  const saveProduct = async () => {
    setIsProgress(true)
    const content = messages[messages.length - 1].content
    const response = await fetch('/dashboard/api/ai/store-product', {
      method: 'POST',
      body: JSON.stringify({
        output: content,
        brandVoiceId,
        projectId,
        action_type: actionType,
        productId
      })
    })

    if (response.ok) {
      const product = await response.json()

      if (product?.success && product?.result) {
        setIsProgress(false)

        router.push(pathname + '?' + createQueryString('productId', product?.result?.id))
      }
    }
  }

  return (
    <div className='grid grid-cols-2'>
      <div className='space-y-4'>
        <div className='mb-6'>
          {
            isProgress && (
              <Alert className={'mb-3'}>
                <AlertCircleIcon className='h-4 w-4 text-white' />
                <AlertTitle>Heads up!</AlertTitle>
                <AlertDescription>
                  Creating product...
                </AlertDescription>
              </Alert>
            )
          }
          <label className='block text-sm font-medium text-gray-700' htmlFor='product-name'>
            Choose your Brand Identity *
          </label>
          <Select onValueChange={setBrandVoiceId}>
            <SelectTrigger>
              <SelectValue placeholder='Brand Identities' />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {
                  brandVoices.map(brandVoice => {
                    return (
                      <SelectItem
                        key={brandVoice.id}
                        title={brandVoice.title}
                        value={brandVoice.id}
                      >
                        {brandVoice.title}
                      </SelectItem>
                    )
                  })
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <form onSubmit={onSubmit as any}>
          <div>
            <label className='mb-4 block text-sm font-medium text-gray-700' htmlFor='product-attributes'>
              Generate copy-writing brief for new product *
            </label>
            <Textarea
              className='h-[360px]'
              placeholder='Write your copywriting brief'
              value={input}
              onChange={handleInputChange}
            />
          </div>
          <Button
            disabled={isDisabled()}
            type={'submit'}
            className='bg-blue-600 mt-8 text-white w-full'>
            Generate content
          </Button>
        </form>
      </div>

      <div className='p-8 space-y-4'>
        <div className='flex justify-between items-center'>
          <h2
            className='text-xl font-semibold'>{isLoading ? 'Generating, please wait until the text load to save...\n' : ''}</h2>
        </div>
        <p className='text-gray-800'>
          {
            messages.map(val => {
              return <>{val.role === 'assistant' ? (
                <>
                  <div className='flex flex-row mr-2'>
                    <div>
                      <Button disabled={isProgress} onClick={saveProduct}>{
                        `${isProgress ? 'Saving product...' : 'Save content'}`
                      }</Button>
                    </div>
                    <br />
                    <div className='mx-4'>
                      <Button onClick={() => {
                        setMessages([])
                      }}>
                        Reset
                      </Button>
                    </div>
                    <br />
                    <div>
                      <Button onClick={() => {
                        return reload()
                      }}>
                        Redo message
                      </Button>
                    </div>
                  </div>
                  {'\n'}
                  <br />
                  <br />
                  {val.content}
                </>
              ) : ''}</>
            })
          }
        </p>
      </div>
    </div>
  )
}