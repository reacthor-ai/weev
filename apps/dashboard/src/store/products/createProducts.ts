import { atomWithMutation } from 'jotai-tanstack-query'
import { useAtom } from 'jotai'
import { ERROR_MESSAGES } from '@/store/types'

type CreateProductsActionAtomParams = {
  prompt: {
    text: string
    image: string
  },
  brandVoiceId: string
  src: string
}

export const createProductsAtom = atomWithMutation(() => ({
  mutationKey: ['createProduct'],
  mutationFn: async (params: CreateProductsActionAtomParams) => {
    try {
      const response = await fetch('/dashboard/api/create-products', {
        method: 'POST',
        body: JSON.stringify(params)
      })

      const createProducts = await response.json()

      if (createProducts) {
        return {
          status: 'fulfilled',
          result: createProducts,
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

export const useCreateProductAtom = () => useAtom(createProductsAtom)