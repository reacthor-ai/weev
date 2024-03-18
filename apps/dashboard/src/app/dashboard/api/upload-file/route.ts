import { uploadFile } from '@/api-utils/gcp/uploadFile'
import { getGCPFile } from '@/api-utils/gcp/getGCPFile'
import { EXPIRY_15_MINUTES } from '@/shared-utils/constant/constant-default'

export async function POST(req: Request) {
  const { text, organizationId, userId, fileId, name, fileType } = await req.json()
  const fileName = `${organizationId}/${name}-${fileId}.txt`

  const { success: isUploadedSuccess, error: fileUploadError } = await uploadFile({
    textFile: text,
    fileId,
    userId,
    organizationId,
    fileType,
    fileName
  })

  if (!isUploadedSuccess) {
    return Response.json({
      error: fileUploadError,
      success: false,
      fileId: null
    })
  }

  const { error, success, url } = await getGCPFile(
    fileName,
    EXPIRY_15_MINUTES
  )

  return Response.json({ error, success, url, fileName })
}