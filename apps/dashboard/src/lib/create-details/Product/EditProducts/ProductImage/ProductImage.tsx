'use client'

import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { UploadFiles } from '@/lib/create-details/Upload'
import { useCallback, useMemo, useState } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircleIcon, PaintbrushIcon } from 'lucide-react'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { Slider } from '@/components/ui/slider'
import { DEFAULT_IMAGE_STRENGTH, DEPTH_OF_FIELD, PRE_STYLE } from '@/lib/create-details/Product/constant'
import { useProductImageControllers } from '@/lib/create-details/Product/hooks'
import { modelList } from '@/api-utils/leonardo/constant'
import { Checkbox } from '@/components/ui/checkbox'
import {
  useListenImageGeneration
} from '@/lib/create-details/Product/EditProducts/ProductImage/useListenImageGeneration'
import { useRouter, useSearchParams } from 'next/navigation'
import { NAVIGATION } from '@/shared-utils/constant/navigation'

type ProductImageProps = {
  organizationId: string
  userId: string
  projectId: string
  clerkId: string
}

export const ProductImage = (props: ProductImageProps) => {
  const { organizationId, userId, clerkId, projectId } = props
  const [files, setFiles] = useState<File[]>([])
  const [prompts, setPrompts] = useState('')
  const [generationId, setGenerationId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { messages } = useListenImageGeneration({ setIsLoading })
  const [loadingUploadImage, setLoadingUploadImage] = useState(false)

  const skipImage = true

  const [inputImage, setInputImage] = useState<string | null>(null)
  const productInfo = useSearchParams()
  const router = useRouter()

  const productId = productInfo.get('productId')

  const image = useMemo(() => {
    if (!messages) return null

    return messages.images.find((image) => image.generationId === generationId)
  }, [generationId, messages])

  const {
    uploadFile,
    depthValue,
    dimensionsValue,
    depthOfFieldDetails,
    controlNetDetails,
    imageStrength,
    setImageStrength,
    uploadImgGCP,
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

  const generateNewProductImage = useCallback(async () => {
    setIsLoading(true)
    if (skipImage) {
      return await generateImage()
    } else {
      return await generateImage()
    }
  }, [skipImage, prompts])

  const generateImage = async (productImgUploadData?: string) => {
    setIsLoading(true)
    try {
      const genProductImgResponse = await fetch('/dashboard/api/ai/generate-product-image', {
        method: 'POST',
        body: JSON.stringify({
          imageId: productImgUploadData,
          model: { id: modelList['PhotoReal'] },
          options: {
            photoRealStrength: depthValue.value,
            presetStyle: preStyle,
            contrastRatio: imageStrength[0],
            height: dimensionsValue.value.height,
            width: dimensionsValue.value.width,
            prompt: prompts,
            initStrength: imageStrength[0]
          }
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const generationId = await genProductImgResponse.json()

      if (generationId) {
        setGenerationId(generationId.result)
        setIsLoading(false)
      }
    } catch (error) {
      setIsLoading(false)
      alert('Please try again')
    }
  }

  const saveImage = async () => {
    if (!image && !productInfo) {
      alert('Please add your image or create your content first.')
    }

    const response = await fetch(image!?.url)

    const blob = await response.blob()

    if (blob) {
      setLoadingUploadImage(true)
      try {
        const gcp = await uploadImgGCP(blob)

        if (gcp?.url) {
          const body = JSON.stringify({
            productId: productId,
            projectId,
            imageSettingsPrompt: [
              {
                text: `model_id: {${modelList['PhotoReal']}}`
              },
              {
                text: `photoRealStrength: {${depthValue.value}}`
              },
              {
                text: `presetStyle: {${preStyle}}`
              },
              {
                text: `contrastRatio: {${imageStrength[0]}}`
              },
              {
                text: `height {${dimensionsValue.value.height}}`
              },
              {
                text: `width {${dimensionsValue.value.width}}`
              },
              {
                text: `initStrength {${imageStrength[0]}}`
              }
            ],
            generalInputImage: inputImage,
            imagePrompt: prompts,
            src: gcp.gcpFileId
          })

          const response = await fetch('/dashboard/api/update-product-image', {
            method: 'post',
            body
          })
          const data = await response.json()

          if (data.success) {
            setLoadingUploadImage(false)
            router.push(`${NAVIGATION.PROJECT_DETAILS}/${projectId}`)
          }
        }
      } catch (error) {
        setIsLoading(false)
        alert('Please try again')
      }
    }
  }

  if (!productId) return null

  return (
    <div className='min-h-screen mt-6'>
      <div className='bg-white rounded-lg pb-10 shadow-lg overflow-hidden'>

        <div className='grid grid-cols-2'>

          <div className='border-r border-gray-200 p-8 space-y-6'>

            <h1 className='text-2xl font-bold'>Image Generation</h1>
            <div>
              <h2 className='text-md block font-medium text-gray-700'>Brand Name: Company Information</h2>
            </div>
            <div className='space-y-4'>
              <div>
                <label className='block mb-4 text-sm font-medium text-gray-700' htmlFor='product-attributes'>
                  Imagery guidelines (Direct the prompt to the type of image)
                </label>
                <Textarea
                  onChange={(e) => setPrompts(e.target.value)}
                  className='h-[360px]'
                  placeholder='Write your imagery guidelines brief'
                  value={prompts}
                />
              </div>
            </div>
            <Button disabled={isLoading || prompts.length === 0} onClick={() => generateImage()}
                    className='bg-blue-600 text-white w-full'>
              {isLoading ? 'Generating Image...' : 'Generate Image'}
            </Button>
          </div>


          <div className='p-8 space-y-4'>
            {
              loadingUploadImage && (
                <>
                  <Alert className={'mb-3'}>
                    <AlertCircleIcon className='h-4 w-4 text-white' />
                    <AlertTitle>Heads up!</AlertTitle>
                    <AlertDescription>
                      Saving image don't exit out...
                    </AlertDescription>
                  </Alert>
                  <br />
                </>
              )
            }
            <div>
              {
                image && <Button
                  disabled={loadingUploadImage}
                  className='mt-4'
                  onClick={saveImage}>
                  {loadingUploadImage ? 'Saving...' : 'Save'}
                </Button>
              }
              {
                isLoading ? (
                  <div className='bg-white rounded-lg shadow-md p-4 animate-pulse'>
                    <div className='w-full h-[400px] bg-gray-300 rounded mb-2'></div>
                  </div>
                ) : (
                  <>
                    {
                      !image ? <>Generate your image for your brand</> : (
                        <Image
                          src={image.url}
                          alt={image.url}
                          width={700}
                          height={500}
                          className='rounded-md'
                        />
                      )
                    }
                  </>
                )
              }
            </div>

            <div>
              <div className='flex items-center space-x-2 mb-4'>
                <Checkbox disabled={skipImage} checked={skipImage} id='terms' />
                <label
                  htmlFor='terms'
                  className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                >
                  Remove uploading file. (Coming soon)
                </label>
              </div>
              <h2 className='text-xl font-semibold'>Image Settings</h2>
              {
                !skipImage && (
                  <div>
                    <UploadFiles
                      title='Upload product images or similar'
                      files={files}
                      setFiles={setFiles}
                      filesAllowed={['png', 'jpg', 'jpeg']}
                    />
                  </div>
                )
              }
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