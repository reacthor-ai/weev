import { uploadFileStream } from '@/api-utils/gcp/uploadFileStream'
import { getGCPFile } from '@/api-utils/gcp/getGCPFile'
import { EXPIRY_15_MINUTES } from '@/shared-utils/constant/constant-default'

export async function POST(req: Request) {
  const data = await req.formData()

  const file: File | null = data.get('file') as unknown as File
  const organizationId = data.get('org-id')
  const fileId = data.get('file-id')
  const name = data.get('name')

  const fileName = `${organizationId}/${name}-${fileId}.png`

  const { success: isImageUploaded } = await uploadFileStream(file, fileName)

  if (!isImageUploaded) return Response.json({ error: 'Error uploading the file', success: false, url: null })

  const { error, success, url } = await getGCPFile(
    fileName,
    EXPIRY_15_MINUTES
  )

  return Response.json({ error, success, url })
}