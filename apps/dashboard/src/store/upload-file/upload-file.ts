import { atomWithMutation } from 'jotai-tanstack-query'
import { useAtom } from 'jotai'
import { ERROR_MESSAGES } from '@/store/types'

type UploadFileActionAtomParams = {
  text: unknown
  organizationId: string
  userId: string
  fileId: string
  name: string
  fileType: string
}

const uploadFileAtom = atomWithMutation(() => ({
  mutationKey: ['uploadFile'],
  mutationFn: async (params: UploadFileActionAtomParams) => {
    try {
      const response = await fetch('/dashboard/api/upload-file', {
        method: 'POST',
        body: JSON.stringify(params)
      })

      const uploadFile = await response.json()

      if (uploadFile) {
        return {
          status: 'fulfilled',
          result: uploadFile,
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

export const useUploadFileAtom = () => useAtom(uploadFileAtom)