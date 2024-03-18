'use client'

import { Textarea } from '@/components/ui/textarea'
import { useState } from 'react'
import { BrandVoiceType, ProductType } from '@/database'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { SpeakerIcon } from 'lucide-react'

type ProductContentProps = {
  clerkId: string
  brandVoices: BrandVoiceType[]
  product: ProductType
}

export const ProductContent = (props: ProductContentProps) => {
  const { clerkId, product } = props

  const [copyWriteBrief, setCopyWriteBrief] = useState('')
  const [imageryGuidelines, setImageryGuidelines] = useState('')

  const isDisabled = () => {
    return imageryGuidelines.length <= 0 || copyWriteBrief.length <= 0
  }

  const newProduct = async () => {
  }

  return (
    <div className='grid grid-cols-2'>
      <div className='space-y-4'>
        <div className='mb-6'>
          <label className='block text-sm font-medium text-gray-700' htmlFor='product-name'>
            Your products brand voice *
          </label>
          <Alert className='my-2'>
            <SpeakerIcon className='h-4 w-4' />
            <AlertTitle>Brand Voice: {product.brandVoice?.title}</AlertTitle>
            <AlertDescription>
              {' \n'}
              {product.brandVoice?.description}
            </AlertDescription>
          </Alert>
        </div>
        <div>
          <label className='mb-4 block text-sm font-medium text-gray-700' htmlFor='product-attributes'>
            Edit new product title Copyrighting brief for new product *
          </label>
          <Textarea
            className='h-[360px]'
            placeholder='Write your copywriting brief'
            value={copyWriteBrief}
            onChange={(e) => setCopyWriteBrief(e.target.value)}
          />
        </div>
        <Button
          disabled={isDisabled()}
          onClick={newProduct}
          className='bg-blue-600 text-white w-full'>
          Generate content
        </Button>
      </div>

      <div className='p-8 space-y-4'>
        <div className='flex justify-between items-center'>
          <h2 className='text-xl font-semibold'>{product.title}</h2>
        </div>
        {/*<p className='text-gray-600 text-sm'>Last changed by Peter Hatch · 1 minute ago</p>*/}
        <p className='text-gray-800'>
          {product.description}
        </p>
      </div>
    </div>
  )
}