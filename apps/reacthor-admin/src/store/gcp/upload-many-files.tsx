import { atomWithMutation } from 'jotai-tanstack-query'
import { useAtom } from 'jotai'
import { REACTHOR_API_ROUTES } from '@/shared-utils/constant/navigation'
import { ERROR_MESSAGES } from '@/store/types'

type UploadManyFilesActionAtomParams = {}

export const UploadManyFilesAtom = atomWithMutation(() => ({
  mutationKey: ['UploadManyFilesAtom'],
  mutationFn: async (params: UploadManyFilesActionAtomParams) => {
    const body = JSON.stringify(params);
    try {
      const response = await fetch(REACTHOR_API_ROUTES.GCP.STORAGE.UPLOAD_FILE, {
        method: 'POST',
        body,
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const result = await response.json()

      if (result) {
        return {
          status: 'fulfilled',
          result,
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

export const useUploadManyFilesAtom = () => useAtom(UploadManyFilesAtom)