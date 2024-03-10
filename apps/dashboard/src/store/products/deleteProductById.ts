import { atomWithMutation } from 'jotai-tanstack-query'
import { useAtom } from 'jotai'
import { ERROR_MESSAGES } from '@/store/types'

type DeleteProductByIdAtomParams = {
  productId: string
}

export const deleteProductByIdAtom = atomWithMutation(() => ({
  mutationKey: ['deleteProduct'],
  mutationFn: async (params: DeleteProductByIdAtomParams) => {
    try {
      const response = await fetch('/dashboard/api/delete-product-by-id', {
        method: 'POST',
        body: JSON.stringify(params)
      })

      const deletedProduct = await response.json()

      if (deletedProduct) {
        return {
          status: 'fulfilled',
          result: deletedProduct,
          error: null
        }
      }

      return {
        status: 'rejected',
        error: ERROR_MESSAGES.DELETED_PRODUCT_ERROR,
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

export const useDeleteProductByIdAtom = () => useAtom(deleteProductByIdAtom)