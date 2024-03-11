'use client'

import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { UploadFiles } from '../Upload'
import { useEffect, useMemo, useState } from 'react'
import { uuid } from 'uuidv4'
import { BrandVoiceType } from '@/database'
import { PRODUCT_IMAGE_PREFIX } from '@/shared-utils/constant/constant-default'
import { useGeneratePersonalizeAIVoiceAtom } from '@/store/ai/store-brand-voice'
import { useGenerateAiProductAtom } from '@/store/ai/generate-ai-product'
import { useRouter } from 'next/navigation'
import { NAVIGATION } from '@/shared-utils/constant/navigation'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { PaintbrushIcon } from 'lucide-react'
import { Slider } from '@/components/ui/slider'
import { GenerateProgressBar } from '@/lib/create-details/Product/GenerateProgressBar'

const CONTROL_NET_SELECT = ['POSE', 'CANNY', 'DEPTH']
const PRE_STYLE = ['CINEMATIC', 'VIBRANT', 'PHOTOGRAPHY', 'CREATIVE', 'NONE']

const DEPTH = ['0.55 (Low)', '0.5 (Medium)', '0.45 (High)']
const DEPTH_OF_FIELD = [
  {
    field: DEPTH[0],
    value: 0.55
  },
  {
    field: DEPTH[1],
    value: 0.50
  },
  {
    field: DEPTH[2],
    value: 0.45
  }
]

const DIMENSIONS = ['512 × 768', '768 × 512', '1360 × 768', '768 × 1360', '512 * 512']
const DIMENSIONS_FIELD = [
  {
    field: DIMENSIONS[0],
    value: { width: 512, height: 768 }
  },
  {
    field: DIMENSIONS[1],
    value: { width: 768, height: 512 }
  },
  {
    field: DIMENSIONS[2],
    value: { width: 1360, height: 768 }
  },
  {
    field: DIMENSIONS[3],
    value: { width: 768, height: 1360 }
  },
  {
    field: DIMENSIONS[4],
    value: { width: 512, height: 512 }
  }
]

const DEFAULT_IMAGE_STRENGTH = 0.1

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

  const [controlNetType, setControlNetType] = useState(CONTROL_NET_SELECT[0])
  const [preStyle, setPreStyle] = useState(PRE_STYLE[0])
  const [depthOfField, setDepthOfField] = useState(DEPTH[0])
  const [imageStrength, setImageStrength] = useState([DEFAULT_IMAGE_STRENGTH])
  const [progress, setProgress] = useState({
    value: 0,
    title: 'Initializing...'
  })

  const [dimensions, setDimensions] = useState(DIMENSIONS[0])

  const [brandUploadProgress, setBrandUploadProgress] = useState('')

  const [{ mutate: generatePersonalizedAIVoice }] = useGeneratePersonalizeAIVoiceAtom()
  const [{ mutate: generateAIProduct }] = useGenerateAiProductAtom()

  const controlNetDetails = {
    'POSE': 'Scans it to identify human or humanoid figures. It then seeks to mimic these poses in your generated image, offering a seamless way to achieve precise character positioning. The feature is versatile and can be applied to a variety of projects, from game development to digital art and more',
    'CANNY': 'You can use this to put an object in a certain environment. Higher strength values preserve more lines, yielding a detailed and intricate result. This makes it ideal for either refining existing line art or creating new artwork from scratch.',
    'DEPTH': 'This allows you to emphasize specific objects in the foreground, subtly integrate elements into the background. Use this in cases where you’re working on a landscape image and you want the mountains in the background to appear distant without affecting the foreground objects. Or when you’re editing a portrait and aim to make the subject stand out against a softly blurred background.'
  }

  const depthOfFieldDetails = {
    [DEPTH[0]]: '0.55 (Low): Keeps everything pretty sharp, great for full scenes like landscapes.',
    [DEPTH[1]]: '0.5 (Medium): Softens the edges a bit, making your subject pop with some background blur.',
    [DEPTH[2]]: '0.45 (High): Really focuses in on your subject, blurring out everything else for that dramatic look.'
  }

  const dimensionsValue = useMemo(() => {
    return DIMENSIONS_FIELD.find(val => val.field === dimensions) || DIMENSIONS_FIELD[0]
  }, [dimensions])

  const depthValue = useMemo(() => {
    return DEPTH_OF_FIELD.find(val => val.field === depthOfField) || DEPTH_OF_FIELD[0]
  }, [depthOfField])

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
        setProgress({ value: 30, title: 'Successfully uploaded file' })
        return { gcpFileId: `${params.name}-${params.fileId}`, url: value.url }
      }
    } catch (error) {
      setProgress({ value: 30, title: 'Error uploading file exiting' })
      return { gcpFileId: `${params.name}-${params.fileId}` }
    }
    return { gcpFileId: `${params.name}-${params.fileId}` }
  }

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
            control_net: false,
            preset_style: preStyle,
            control_net_type: controlNetType,
            photo_real_strength: depthValue.value,
            init_strength: imageStrength[0]
          }
        }, {
          onSettled: (res) => {
            if (res && res.status === 'fulfilled') {
              setProgress({ value: 30, title: 'Success taking you to the product page now...' })
              setTimeout(() => {
                router.push(NAVIGATION.PROJECTS)
              }, 1000)
            } else {
              setProgress({ value: 20, title: 'Error something went wrong.' })
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
      if (brandVoiceId.length > 0) {
        setBrandUploadProgress('Generating Brand voice Content...')
        await generatePersonalizedAIVoice({
          brandVoiceId,
          max_token: 1000,
          clerkId
        }, {
          onSettled: (res) => {
            if (res && res.result) {
              setBrandUploadProgress('Done!')
              setBrandVoice((res.result.message as string).trim())
            }
          }
        })
      }
    }

    updatePersonalizedVoice()
  }, [brandVoiceId])

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

            <GenerateProgressBar
              progress={progress}
              isDisabled={isDisabled}
              brandVoiceId={brandVoiceId}
              newProduct={newProduct}
            />
          </div>
          <div className='p-8 space-y-4'>
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

          <div className='p-8 space-y-4'>
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
                step={0.1}
                onValueCommit={(num) => setImageStrength(num)}
                className={'w-[60%]'}
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
  )
}
