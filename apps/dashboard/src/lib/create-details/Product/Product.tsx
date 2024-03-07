'use client'

import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { UploadFiles } from '../Upload'
import { useState } from 'react'
import { uuid } from 'uuidv4'
import { useCreateProductAtom } from '@/store/products/createProducts'
import { BrandVoiceType } from '@/database'

type ProductCreateDetailsProps = {
  organizationId: string
  userId: string
  brandVoices: BrandVoiceType[]
}

export const ProductCreateDetails = (props: ProductCreateDetailsProps) => {
  const { organizationId, userId, brandVoices } = props

  const [files, setFiles] = useState<File[]>([])
  const [brandVoiceId, setBrandVoiceId] = useState<string>('')
  const [imageryGuidelines, setImageryGuidelines] = useState('')
  const [copyWriteBrief, setCopyWriteBrief] = useState('')

  const [{ mutate: createProduct }] = useCreateProductAtom()

  const uploadFile = async () => {
    const params = {
      fileId: uuid(),
      name: 'product-image',
      organizationId,
      userId
    }

    const formData = new FormData()

    formData.append('file', files[0], files[0].name)
    formData.append('file-id', params.fileId)
    formData.append('name', params.name)
    formData.append('org-id', params.organizationId)
    formData.append('user-id', params.userId)

    try {
      const res = await fetch('/dashboard/api/upload-image', {
        method: 'POST',
        body: formData
      })

      if (res.ok) {
        return { gcpFileId: `${params.name}-${params.fileId}` }
      }
    } catch (error) {
      console.log({ error })
      return { gcpFileId: `${params.name}-${params.fileId}` }
    }
    return { gcpFileId: `${params.name}-${params.fileId}` }
  }

  const newProduct = async () => {
    uploadFile().then(
      async (res) => {
        createProduct({
          prompt: {
            text: copyWriteBrief,
            image: imageryGuidelines
          },
          brandVoiceId,
          src: res.gcpFileId
        })
      }
    )
  }

  const isDisabled = () => {
    return imageryGuidelines.length <= 0 || copyWriteBrief.length <= 0
  }

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
              <div>
                <label className='mb-4 block text-sm font-medium text-gray-700' htmlFor='product-attributes'>
                  Copywriting brief for new product *
                </label>
                <Textarea
                  className='h-[360px]'
                  placeholder='Write your copywriting brief'
                  value={copyWriteBrief}
                  onChange={(e) => setCopyWriteBrief(e.target.value)}
                />
              </div>
            </div>
            <Button disabled={isDisabled()} onClick={newProduct} className='bg-blue-600 text-white w-full'>Generate
              content</Button>
          </div>
          <div className='p-8 space-y-4'>
            <div className='flex flex-col justify-between'>
              <h2 className='text-xl font-semibold'>Add Image</h2>
              <div>
                <UploadFiles
                  title='Upload product images or similar'
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
                  value={imageryGuidelines}
                  onChange={(e) => setImageryGuidelines(e.target.value)}
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
