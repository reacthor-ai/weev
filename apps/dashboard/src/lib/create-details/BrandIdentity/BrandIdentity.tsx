'use client'

import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { UploadFiles } from '../Upload'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { useCreateBrandVoiceAtom } from '@/store/brand-voice/brand-voice'
import { pdfToText } from 'pdf-ts'
import { useUploadFileAtom } from '@/store/upload-file'
import { uuid } from 'uuidv4'
import { useRouter } from 'next/navigation'
import { BRAND_VOICE_PREFIX } from '@/shared-utils/constant/constant-default'
import { NAVIGATION } from '@/shared-utils/constant/navigation'

const FILES_ALLOWED = ['.pdf', '.txt']

type BrandIdentityCreateDetailsProps = {
  organizationId: string
  id: string
  clerkId: string
}

export const BrandIdentityCreateDetails = (props: BrandIdentityCreateDetailsProps) => {
  const { organizationId, id: userId, clerkId } = props
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState('')
  const [audience, setAudience] = useState('')
  const [voice, setVoice] = useState('')
  const [emotions, setEmotions] = useState('')
  const [photoGuidelines, setPhotoGuidelines] = useState('')
  const [files, setFiles] = useState<File[]>([])

  const [{ mutate: mutateBrandVoice }] = useCreateBrandVoiceAtom()
  const [{ mutate: uploadFile }] = useUploadFileAtom()

  const isDisabled = () => {
    return (
      title.length === 0 &&
      description.length === 0 &&
      audience.length === 0 &&
      voice.length === 0 &&
      emotions.length === 0 &&
      photoGuidelines.length === 0
    )
  }

  const createBrandVoice = async (gcpLink: string) => {
    const brandVoice = {
      title,
      description,
      type
    }

    const prompt = {
      text: {
        audience,
        voice,
        emotions,
        photoGuidelines
      }
    }

    await mutateBrandVoice({
      brandVoice,
      prompt,
      link: gcpLink,
      clerkId,
      organizationId
    })
  }

  const handleUploadBrand = async () => {
    setLoading(true)
    if (files.length === 0) {
      alert('Please select files first.')
      return ''
    }

    const formData = new FormData()
    files.forEach(file => formData.append('files[]', file)) // 'files[]' to indicate multiple values for the same name

    const fileId = uuid()

    for (const file of files) {
      if (file.type === 'application/pdf') {
        const reader = new FileReader()

        reader.onload = async (e) => {
          const typedArray = new Uint8Array((e as any).target.result as any)
          const pdf = await pdfToText(typedArray)

          await uploadFile({
            uploadFile: pdf,
            organizationId,
            userId,
            name: BRAND_VOICE_PREFIX,
            fileType: 'text/plain',
            fileId
          }, {
            onSettled: async (res) => {
              if (res && res.status === 'fulfilled') {
                await createBrandVoice(res.result.gcpFileId).then(() => {
                  router.push(NAVIGATION.BRAND_VOICE)
                  setLoading(false)
                })
              } else router.refresh()
            }
          })
        }

        reader.readAsArrayBuffer(file)

      } else if (file.type === 'text/plain') {
        const text = await file.text()
        await uploadFile({
          uploadFile: text,
          organizationId,
          userId,
          name: BRAND_VOICE_PREFIX,
          fileType: 'text/plain',
          fileId
        }, {
          onSettled: async (res) => {
            if (res && res.status === 'fulfilled') {
              await createBrandVoice(res.result.gcpFileId).then(() => {
                router.push(NAVIGATION.BRAND_VOICE)
                setLoading(false)
              })
            }
          }
        })
      }
    }
  }

  return (
    <div className='min-h-screen p-8'>
      <div className='bg-white rounded-lg shadow-lg overflow-hidden'>
        <div className='grid grid-cols-2'>
          <div className='border-r border-gray-200 p-8 space-y-6'>
            <h1 className='text-2xl font-bold'>New Brand Voice</h1>
            <div className='space-y-4'>
              <div className='mb-6'>
                <label className='block text-sm font-medium text-gray-700' htmlFor='brand-name'>
                  Brand Name *
                </label>
                <Input
                  placeholder='Your brand name'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className='mb-6'>
                <label className='block text-sm font-medium text-gray-700' htmlFor='brand-type'>
                  Brand Type *
                </label>
                <Input
                  placeholder='Your brand type for reference name'
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                />
              </div>
              <div>
                <label className='mb-4 block text-sm font-medium text-gray-700' htmlFor='brand-story'>
                  Brand Story (Should be 300 words or more). *
                </label>
                <Textarea
                  className='h-[360px]'
                  placeholder='Write your brand story'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <Button
                disabled={isDisabled() || files.length === 0}
                className='bg-blue-600 text-white w-full' onClick={handleUploadBrand}>
                {loading ? 'Loading content...' : 'Generated Content'}
              </Button>
            </div>
          </div>
          <div className='p-8 space-y-4'>
            <div className='flex flex-col justify-between'>
              <h2 className='text-xl font-semibold'>Brand guidelines</h2>
              <div>
                <UploadFiles
                  files={files}
                  setFiles={setFiles}
                  title='Upload your brand Guidelines'
                  filesAllowed={FILES_ALLOWED}
                />
              </div>

              {/* Additional inputs for brand voice details */}
              <div>
                <label className='mb-2 block text-sm font-medium text-gray-700' htmlFor='target-audience'>
                  Target Audience
                </label>
                <Input
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                />
              </div>
              <div>
                <label className='mb-2 mt-2 block text-sm font-medium text-gray-700' htmlFor='tone-of-voice'>
                  Tone of Voice
                </label>
                <Input
                  value={voice}
                  onChange={(e) => setVoice(e.target.value)}
                />
              </div>
              <div>
                <label className='mb-2 mt-2 block text-sm font-medium text-gray-700' htmlFor='emotions'>
                  Emotions
                </label>
                <Input
                  value={emotions}
                  onChange={(e) => setEmotions(e.target.value)}
                />
              </div>
              <div>
                <label className='mb-2 mt-2 block text-sm font-medium text-gray-700'
                       htmlFor='photography-guideline-summary'>
                  Photography Guideline Summary
                </label>
                <Input
                  value={photoGuidelines}
                  onChange={(e) => setPhotoGuidelines(e.target.value)}
                />
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
