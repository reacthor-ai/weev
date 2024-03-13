import { atomWithMutation } from 'jotai-tanstack-query'
import { useAtom } from 'jotai'
import { ERROR_MESSAGES } from '@/store/types'

type CreateImageAtomParams = {
  productId: string
  src: string
}

export const createImageAtom = atomWithMutation(() => ({
    mutationKey: ['createImage'],
    mutationFn: async (params: CreateImageAtomParams) => {
      const response = await fetch('/dashboard/api/create-image', {
        method: 'POST',
        body: JSON.stringify(params)
      })

      const createImage = await response.json()

      try {
        if (createImage) {
          return {
            status: 'fulfilled',
            result: createImage,
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
  }
))

export const useCreateImageAtom = () => useAtom(createImageAtom)