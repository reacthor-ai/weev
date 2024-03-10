'use client'

import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { UploadFiles } from '../Upload'
import { useEffect, useState } from 'react'
import { uuid } from 'uuidv4'
import { BrandVoiceType } from '@/database'
import { PRODUCT_IMAGE_PREFIX } from '@/shared-utils/constant/constant-default'
import { useGeneratePersonalizeAIVoiceAtom } from '@/store/ai/store-brand-voice'
import { useGenerateAiProductAtom } from '@/store/ai/generate-ai-product'
import { useRouter } from 'next/navigation'
import { NAVIGATION } from '@/shared-utils/constant/navigation'

type ProductCreateDetailsProps = {
  organizationId: string
  projectId: string
  userId: string
  clerkId: string
  brandVoices: BrandVoiceType[]
}

export const ProductCreateDetails = (props: ProductCreateDetailsProps) => {
  const router = useRouter()
  const { organizationId, userId, brandVoices, clerkId, projectId } = props
  const [brandVoice, setBrandVoice] = useState<string>('')
  const [files, setFiles] = useState<File[]>([])
  const [brandVoiceId, setBrandVoiceId] = useState<string>('')
  const [imageryGuidelines, setImageryGuidelines] = useState('')
  const [copyWriteBrief, setCopyWriteBrief] = useState('')

  const [{ mutate: generatePersonalizedAIVoice }] = useGeneratePersonalizeAIVoiceAtom()
  const [{ mutate: generateAIProduct }] = useGenerateAiProductAtom()

  const uploadFile = async () => {
    const params = {
      fileId: uuid(),
      name: PRODUCT_IMAGE_PREFIX,
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
      const value = await res.json()
      if (res.ok) {
        return { gcpFileId: `${params.name}-${params.fileId}`, url: value.url }
      }
    } catch (error) {
      console.log({ error })
      return { gcpFileId: `${params.name}-${params.fileId}` }
    }
    return { gcpFileId: `${params.name}-${params.fileId}` }
  }

  const newProduct = async () => {
    uploadFile().then(async res => {
      if (res && res.url.length > 0) {
        generateAIProduct({
          brand_voice: brandVoice,
          clerkId,
          projectId,
          brandVoiceId,
          model_id: 'PhotoReal',
          marketing_requirements: copyWriteBrief,
          image: {
            prompt: imageryGuidelines,
            url: res?.url
          }
        }, {
          onSettled: (res) => {
            if (res && res.status === 'fulfilled') {
              router.push(NAVIGATION.PROJECTS)
            }
          }
        })
      }
    })
  }

  const isDisabled = () => {
    return imageryGuidelines.length <= 0 || copyWriteBrief.length <= 0
  }

  useEffect(() => {
    const updatePersonalizedVoice = async () => {
      await generatePersonalizedAIVoice({
        brandVoiceId,
        max_token: 1000,
        clerkId
      }, {
        onSettled: (res) => {
          console.log({ res })
          if (res && res.result) {
            setBrandVoice((res.result.message as string).trim())
          }
        }
      })
    }

    updatePersonalizedVoice()
  }, [brandVoiceId])

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
            <Button
              disabled={isDisabled() || brandVoiceId.length <= 0}
              onClick={newProduct}
              className='bg-blue-600 text-white w-full'>
              Generate content
            </Button>
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
