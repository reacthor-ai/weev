import { atomWithMutation } from 'jotai-tanstack-query'
import { useAtom } from 'jotai'
import { ERROR_MESSAGES } from '@/store/types'

type UploadFileActionAtomParams = {
  fileName: string
  organizationId: string
  fileContent: unknown

  userId: string
  name: string
  fileType: string
}

const uploadFileAtom = atomWithMutation(() => ({
  mutationKey: ['uploadFile'],
  mutationFn: async (params: UploadFileActionAtomParams) => {
    const { fileName: file } = params
    const fileName = encodeURIComponent(file)

    try {

      const res = await fetch(`/api/upload-url?file=${fileName}`)
      if (!res.ok) {
        return {
          status: 'rejected',
          result: null,
          error: 'Failed to get upload URL'
        }
      }

      const { url, fields } = await res.json()

      const formData = new FormData()
      Object.entries({ ...fields, file }).forEach(([key, value]: any) => {
        formData.append(key, value)
      })

      const upload = await fetch(url, {
        method: 'POST',
        body: formData
      })

      if (upload.ok) {
        const uploadFile = await upload.json()
        return {
          status: 'fulfilled',
          result: uploadFile,
          error: null
        }
      } else {
        return {
          status: 'rejected',
          result: null,
          error: 'Upload failed'
        }
      }
    } catch (error) {
      return {
        status: 'rejected',
        result: null,
        error: error || ERROR_MESSAGES.INTERNAL_SERVER_ERROR
      }
    }
  }
}))

export const useUploadFileAtom = () => useAtom(uploadFileAtom)