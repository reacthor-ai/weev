import { useGeneratePersonalizeAIVoiceAtom } from '@/store/ai/store-brand-voice'
import { useCallback, useEffect, useState } from 'react'

type UpdatePersonalizedVoiceProps = {
  brandVoiceId: string
  clerkId: string
}

export const updatePersonalizedVoice = (props: UpdatePersonalizedVoiceProps) => {
  const { brandVoiceId, clerkId } = props

  const [brandVoice, setBrandVoice] = useState<string>('')
  const [brandUploadProgress, setBrandUploadProgress] = useState('')
  const [{ mutate: generatePersonalizedAIVoice }] = useGeneratePersonalizeAIVoiceAtom()

  const updatePersonalizedVoice = useCallback(async () => {
    if (brandVoiceId.length === 0) return

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
  }, [brandVoiceId])

  useEffect(() => {
    updatePersonalizedVoice()
  }, [updatePersonalizedVoice])
  return {
    brandUploadProgress,
    brandVoice
  }
}