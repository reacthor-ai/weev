'use client'

import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { UploadFiles } from '@/lib/create-details/Upload'
import { useCallback, useState } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { PaintbrushIcon } from 'lucide-react'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { Slider } from '@/components/ui/slider'
import { DEFAULT_IMAGE_STRENGTH, DEPTH_OF_FIELD, PRE_STYLE } from '@/lib/create-details/Product/constant'
import { useProductImageControllers } from '@/lib/create-details/Product/hooks'
import { modelList } from '@/api-utils/leonardo/constant'
import { Checkbox } from '@/components/ui/checkbox'
import { WEEEV_AI_API_URL } from '@/shared-utils/constant/constant-default'

type ProductImageProps = {
  organizationId: string
  userId: string
  productId: string
  clerkId: string
}

export const ProductImage = (props: ProductImageProps) => {
  const { organizationId, userId, clerkId } = props
  const [files, setFiles] = useState<File[]>([])
  const [prompts, setPrompts] = useState('')
  const [generationId, setGenerationId] = useState<string | null>(null)
  const [skipImage, setSkipImage] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [url, setUrl] = useState<string | null>(null)
  const [startPolling, setStartPolling] = useState(false)

  const pollingCallback = async () => {
    try {
      const response = await fetch(`/dashboard/api/ai/get-product-image-status?generationId=${generationId}`)
      if (!response.ok) throw new Error('Network response was not ok')
      const data = await response.json()
      console.log({ data })
      if (data.result && 'url' in data.result) {
        setIsLoading(false)
        setUrl(data.result.url)
        return data
      }
    } catch (error) {
      console.error('Fetch error:', error)
      throw error
    }
  }

  const {
    uploadFile,
    depthValue,
    dimensionsValue,
    depthOfFieldDetails,
    controlNetDetails,
    imageStrength,
    setImageStrength,
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
      await generateImage()
    } else {
      uploadFile().then(
        async (fileUploadRes) => {
          try {
            if (!fileUploadRes?.url) return

            const uploadProductImgResponse = await fetch(`${WEEEV_AI_API_URL}/product/upload-single-image`, {
              method: 'POST',
              body: JSON.stringify({
                url: fileUploadRes.url
              }),
              headers: {
                'User-Id': clerkId,
                'Content-Type': 'application/json'
              }
            })

            const { result: productImgUploadData, success }: {
              result: string,
              success: boolean
            } = await uploadProductImgResponse.json()

            if (success && productImgUploadData) {
              await generateImage(productImgUploadData)
            }
          } catch (error) {
            console.log(`Error uploading image`, error)
          }
        }
      )

    }
  }, [skipImage])

  const generateImage = async (productImgUploadData?: string) => {
    if (prompts.length === 0) alert('Please fill out your prompt')

    const body = JSON.stringify({
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
    })

    const genProductImgResponse = await fetch('/dashboard/api/ai/generate-product-image', {
      method: 'POST',
      body
    })

    const generationId = await genProductImgResponse.json()

    if (generationId) {
      setGenerationId(generationId.result)
    }
  }

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
                />
              </div>
            </div>
            <Button disabled={isLoading} onClick={generateNewProductImage} className='bg-blue-600 text-white w-full'>
              {isLoading ? 'Generating Image...' : 'Generate Image'}
            </Button>
          </div>


          <div className='p-8 space-y-4'>
            <div>
              {
                isLoading ? (
                  <div className='bg-white rounded-lg shadow-md p-4 animate-pulse'>
                    <div className='w-full h-[400px] bg-gray-300 rounded mb-2'></div>
                  </div>
                ) : (
                  <>
                    {
                      !url ? <>Generate your image for your brand</> : (
                        <Image
                          src={`https://cdn.leonardo.ai/users/655cab70-b1ba-4eb5-b878-3ba0ec055fc5/generations/128ec322-26f3-447e-8b92-bf5b644cb76b/variations/Default_Experience_the_perfect_blend_of_fashion_and_sustainabi_0_128ec322-26f3-447e-8b92-bf5b644cb76b_0.jpg?w=512`}
                          alt={'image logo'}
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
                <Checkbox onCheckedChange={(e) => setSkipImage(e as boolean)} checked={skipImage} id='terms' />
                <label
                  htmlFor='terms'
                  className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                >
                  Remove uploading file.
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

            {/*<div className='mb-6'>*/}
            {/*  <label className='block mb-2 text-sm font-medium text-gray-700'>*/}
            {/*    Tweak your image **/}
            {/*  </label>*/}
            {/*  <Select onValueChange={setControlNetType}>*/}
            {/*    <SelectTrigger>*/}
            {/*      <SelectValue placeholder='Tweek your images setting' />*/}
            {/*    </SelectTrigger>*/}
            {/*    <SelectContent>*/}
            {/*      <SelectGroup>*/}
            {/*        {*/}
            {/*          CONTROL_NET_SELECT.map(controlNet => {*/}
            {/*            return (*/}
            {/*              <SelectItem*/}
            {/*                key={controlNet}*/}
            {/*                value={controlNet}*/}
            {/*              >*/}
            {/*                {controlNet}*/}
            {/*              </SelectItem>*/}
            {/*            )*/}
            {/*          })*/}
            {/*        }*/}
            {/*      </SelectGroup>*/}
            {/*    </SelectContent>*/}
            {/*  </Select>*/}
            {/*</div>*/}

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