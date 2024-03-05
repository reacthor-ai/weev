import { atomWithMutation } from 'jotai-tanstack-query'
import { useAtom } from 'jotai'
import { ERROR_MESSAGES } from '@/store/types'

type DeleteProductsActionAtomParams = {
  productId: string
}

export const deleteProductsAtom = atomWithMutation(() => ({
  mutationKey: ['deleteProducts'],
  mutationFn: async (params: DeleteProductsActionAtomParams) => {
    try {
      const response = await fetch('/dashboard/projects/details/delete/api', {
        method: 'POST',
        body: JSON.stringify(params)
      })

      const deleteProducts = await response.json()

      if (deleteProducts) {
        return {
          status: 'fulfilled',
          result: deleteProducts,
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

export const useDeleteProductsAtom = () => useAtom(deleteProductsAtom)