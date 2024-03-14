'use client'

import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { UploadFiles } from '../Upload'
import { useState } from 'react'
import { BrandVoiceType } from '@/database'
import { useGenerateAiProductAtom } from '@/store/ai/generate-ai-product'
import { useRouter } from 'next/navigation'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { PaintbrushIcon } from 'lucide-react'
import { Slider } from '@/components/ui/slider'
import { GenerateProgressBar } from '@/lib/create-details/Product/GenerateProgressBar'
import { updatePersonalizedVoice, useProductImageControllers } from '@/lib/create-details/Product/hooks'
import {
  CONTROL_NET_SELECT,
  DEFAULT_IMAGE_STRENGTH,
  DEPTH_OF_FIELD,
  DIMENSIONS,
  PRE_STYLE
} from '@/lib/create-details/Product/constant'
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
  const [files, setFiles] = useState<File[]>([])
  const [brandVoiceId, setBrandVoiceId] = useState<string>('')
  const [imageryGuidelines, setImageryGuidelines] = useState('')
  const [copyWriteBrief, setCopyWriteBrief] = useState('')

  const [progress, setProgress] = useState({
    value: 0,
    title: 'Initializing...'
  })

  const [{ mutate: generateAIProduct }] = useGenerateAiProductAtom()

  const {
    uploadFile,
    depthValue,
    dimensionsValue,
    depthOfFieldDetails,
    controlNetDetails,
    imageStrength,
    setImageStrength,
    setDimensions,
    setControlNetType,
    setDepthOfField,
    setPreStyle,
    controlNetType,
    preStyle,
    depthOfField
  } = useProductImageControllers({
    organizationId,
    files,
    userId
  })

  const {
    brandUploadProgress,
    brandVoice
  } = updatePersonalizedVoice({
    brandVoiceId,
    clerkId
  })

  const newProduct = async () => {
    setProgress({ value: 20, title: 'Uploading file...' })
    uploadFile().then(async res => {
      if (res && res.url.length > 0) {
        setProgress({ value: 20, title: 'Generating AI Product title and image...' })
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
          },
          extraGenInfo: {
            width: dimensionsValue.value.width,
            height: dimensionsValue.value.height,
            control_net: true,
            preset_style: preStyle,
            control_net_type: controlNetType,
            photo_real_strength: depthValue.value,
            init_strength: imageStrength[0]
          }
        }, {
          onSettled: (res) => {
            if (res) {
              if (res.status === 'fulfilled') {
                setProgress({ value: 30, title: 'Success taking you to the product page now...' })
                setTimeout(() => {
                  router.push(NAVIGATION.PROJECTS)
                }, 1000)
              } else if (res.status === 'rejected') {
                setProgress({ value: 20, title: 'Error something went wrong.' })
              }
            }
          }
        })
      }
    })
  }

  const isDisabled = () => {
    return imageryGuidelines.length <= 0 || copyWriteBrief.length <= 0
  }

  return (
    <div className='min-h-screen p-8'>
      <div className='bg-white rounded-lg shadow-lg overflow-hidden'>
        <div className='grid grid-cols-3  mb-8'>
          <div className='border-r border-gray-200 p-8 space-y-6'>
            <h1 className='text-2xl font-bold'>New Product</h1>

            <div className='space-y-4'>
              <div className='mb-6'>
                <label className='block text-sm font-medium text-gray-700' htmlFor='product-name'>
                  Choose your Brand Identity *
                </label>
                <p className='my-2'>{brandUploadProgress}</p>
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
                  Copyrighting brief for new product *
                </label>
                <Textarea
                  className='h-[360px]'
                  placeholder='Write your copywriting brief'
                  value={copyWriteBrief}
                  onChange={(e) => setCopyWriteBrief(e.target.value)}
                />
              </div>
            </div>

            <GenerateProgressBar
              progress={progress}
              isDisabled={isDisabled}
              brandVoiceId={brandVoiceId}
              newProduct={newProduct}
            />
          </div>
          <div className='p-8 space-y-4'>
            <div>
              <h2 className='text-xl font-semibold'>Add Image</h2>
              <div>
                <UploadFiles
                  title='Upload product images or similar'
                  files={files}
                  setFiles={setFiles}
                  filesAllowed={['png', 'jpg', 'jpeg']}
                />
              </div>
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

            <div className='flex flex-col justify-between'>
            </div>
          </div>

          <div className='p-8 space-y-4'>
            <h2 className='text-xl font-semibold'>Add Settings</h2>
            <div className='mb-6'>
              <label className='block mb-2 text-sm font-medium text-gray-700'>
                Add your dimensions *
              </label>
              <Select onValueChange={setDimensions}>
                <SelectTrigger>
                  <SelectValue placeholder='Add your width and height' />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {
                      DIMENSIONS.map(m => {
                        return (
                          <SelectItem
                            key={m}
                            value={m}
                          >
                            {m}
                          </SelectItem>
                        )
                      })
                    }
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className='my-4'>
              <label className='block mb-2 text-sm font-medium text-gray-700'>
                Depth of Field: Controls the sharpness range.
              </label>

              <Alert className='my-2'>
                <PaintbrushIcon className='h-4 w-4' />
                <AlertTitle>Heads up for Depth of field!</AlertTitle>
                <AlertDescription>
                  {' \n'}
                  {depthOfFieldDetails[depthOfField]}
                </AlertDescription>
              </Alert>

              <Select onValueChange={setDepthOfField}>
                <SelectTrigger>
                  <SelectValue placeholder='Depth of field' />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {
                      DEPTH_OF_FIELD.map(depth => {
                        return (
                          <SelectItem
                            key={depth.field}
                            value={depth.field}
                            title={depth.field}
                          >
                            {depth.field}
                          </SelectItem>
                        )
                      })
                    }
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className='mb-6'>
              <label className='block mb-2 text-sm font-medium text-gray-700'>
                How strong your generated image should reflect your original image *
              </label>

              {imageStrength.map(d => d)}

              <Slider
                defaultValue={[DEFAULT_IMAGE_STRENGTH]}
                max={0.9}
                step={0.01}
                onValueCommit={(num) => setImageStrength(num)}
                className={'w-[60%]'}
              />
            </div>

            <Alert className='my-2'>
              <PaintbrushIcon className='h-4 w-4' />
              <AlertTitle>Heads up!</AlertTitle>
              <AlertDescription>
                {' \n'}
                {controlNetDetails[controlNetType]}
              </AlertDescription>
            </Alert>

            <div className='mb-6'>
              <label className='block mb-2 text-sm font-medium text-gray-700'>
                Tweak your image *
              </label>
              <Select onValueChange={setControlNetType}>
                <SelectTrigger>
                  <SelectValue placeholder='Tweek your images setting' />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {
                      CONTROL_NET_SELECT.map(controlNet => {
                        return (
                          <SelectItem
                            key={controlNet}
                            value={controlNet}
                          >
                            {controlNet}
                          </SelectItem>
                        )
                      })
                    }
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className='mb-6'>
              <label className='block mb-2 text-sm font-medium text-gray-700'>
                Add Pre style *
              </label>
              <Select onValueChange={setPreStyle}>
                <SelectTrigger>
                  <SelectValue placeholder='Pre Style' />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {
                      PRE_STYLE.map(style => {
                        return (
                          <SelectItem
                            key={style}
                            value={style}
                          >
                            {style}
                          </SelectItem>
                        )
                      })
                    }
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

          </div>

        </div>
      </div>
    </div>
  )
}
