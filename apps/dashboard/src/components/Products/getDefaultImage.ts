import { atomWithMutation } from 'jotai-tanstack-query'
import { useAtom } from 'jotai'
import { ERROR_MESSAGES } from '@/store/types'
import { WEEEV_AI_API_URL } from '@/shared-utils/constant/constant-default'

type GetDefaultImageAtomProps = {
  imageId: string
}

export const getDefaultImageAtom = atomWithMutation(() => ({
  mutationKey: ['getDefaultImage'],
  mutationFn: async (params: GetDefaultImageAtomProps) => {
    try {
      const response = await fetch(`${WEEEV_AI_API_URL}/get-single-image/${params.imageId}`, {
        method: 'GET',
        body: JSON.stringify(params)
      })

      const image = await response.json()

      if (image && image.success) {
        return {
          status: 'fulfilled',
          result: {
            url: image.message.init_images_by_pk.url,
            status: 'Done'
          },
          error: null
        }
      }

      return {
        status: 'rejected',
        error: ERROR_MESSAGES.IMAGE_RESULT_ERROR,
        result: {
          url: '',
          status: 'Pending'
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

export const useGetDefaultImageAtom = () => useAtom(getDefaultImageAtom)