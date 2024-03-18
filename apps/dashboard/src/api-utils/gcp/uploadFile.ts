import { bucket } from '@/api-utils/gcp/storage'

type UploadFileParams = {
  fileId: string
  organizationId: string
  userId: string
  fileType: string
  textFile: string
  fileName: string
}

export const uploadFile = async (params: UploadFileParams) => {
  const { organizationId, fileId, textFile, fileType, userId, fileName } = params

  try {
    await bucket.file(fileName).save(textFile, {
      contentType: fileType,
      metadata: {
        organizationId,
        userId,
        fileId
      }
    })

    return {
      success: true,
      data: fileName,
      error: null
    }
  } catch (err) {
    return {
      error: err,
      success: false,
      data: null
    }
  }
}