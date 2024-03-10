import { atomWithMutation } from 'jotai-tanstack-query'
import { useAtom } from 'jotai'
import { ERROR_MESSAGES } from '@/store/types'
import { getBrandVoiceDocsGCP } from '@/store/ai/api/getBrandVoiceDocsGCP'
import { uniqueVoiceByAI } from '@/store/ai/api/uniqueVoice'

type GeneratePersonalizeAIVoiceAtomParams = {
  brandVoiceId: string
  clerkId: string
  max_token?: number
}

export const generatePersonalizeAIVoiceAtom = atomWithMutation(() => ({
  mutationKey: ['generatePersonalizeAIVoice'],
  mutationFn: async (params: GeneratePersonalizeAIVoiceAtomParams) => {
    const { brandVoiceId, max_token, clerkId } = params
    if (!brandVoiceId) {
      return {
        status: 'rejected',
        result: null,
        error: ERROR_MESSAGES.BRAND_VOICE_MISSING_FIELDS
      }
    }

    try {
      const url = await getBrandVoiceDocsGCP({ brandVoiceId })

      const personalAIBrandVoice = await uniqueVoiceByAI({
        prompt: 'Summarize The brand voice in 400 words or less',
        max_token,
        url: url.document,
        clerkId
      })

      if (personalAIBrandVoice) {
        return {
          status: 'fulfilled',
          result: personalAIBrandVoice,
          error: null
        }
      }
    } catch (error) {
      return {
        status: 'rejected',
        result: null,
        error: error
      }
    }
  }
}))

export const useGeneratePersonalizeAIVoiceAtom = () => useAtom(generatePersonalizeAIVoiceAtom)