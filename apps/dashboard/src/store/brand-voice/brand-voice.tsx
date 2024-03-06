import { atomWithMutation } from 'jotai-tanstack-query'
import { useAtom } from 'jotai'
import { ERROR_MESSAGES } from '@/store/types'

type CreateBrandVoiceActionAtomParams = {
  organizationId: string;
  clerkId: string;
  brandVoice: {
    title: string;
    description: string;
    type: string;
  };
  prompt: {
    text: {
      audience: string;
      voice: string;
      emotions: string;
      photoGuidelines: string;
    };
  };
  link: string
}

export const createBrandVoiceAtom = atomWithMutation(() => ({
  mutationKey: ['createBrandVoice'],
  mutationFn: async (params: CreateBrandVoiceActionAtomParams) => {
    try {
      const response = await fetch('/dashboard/api/create-brand-voice', {
        method: 'POST',
        body: JSON.stringify(params)
      })

      const createBrandVoice = await response.json()

      if (createBrandVoice) {
        return {
          status: 'fulfilled',
          result: createBrandVoice,
          error: null
        }
      }

      return {
        status: 'rejected',
        error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        result: null
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

export const useCreateBrandVoiceAtom = () => useAtom(createBrandVoiceAtom)