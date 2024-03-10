import { gcpStorage } from '@/shared-utils/constant/storage'

const bucket = gcpStorage.bucket(process.env.BUCKET_NAME as string)

const getImageData = async (data: FormData) => {
  const file: File | null = data.get('file') as unknown as File

  let error, success, gcpFileId

  const organizationId = data.get('org-id')
  const fileId = data.get('file-id')
  const name = data.get('name')
  const userId = data.get('user-id')

  const fileName = `${organizationId}/${name}-${fileId}.png`

  try {
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const blob = bucket.file(fileName)
    const stream = blob.createWriteStream({
      resumable: false,
      metadata: {
        organizationId,
        userId,
        fileId
      }
    })

    stream.on('error', (err) => {
      return Response.json({ error: err.cause, success: false })
    })

    stream.on('finish', () => {
      success = true
      gcpFileId = fileName
    })

    stream.end(buffer)
  } catch (err) {
    error = err
    success = false
  }

  return {
    fileName,
    error,
    success
  }
}

export async function POST(req: Request) {
  const data = await req.formData()
  let error, success, url

  const { fileName } = await getImageData(data)

  try {
    const [bucketResponse] = await bucket.file(fileName).getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: Date.now() + 15 * 60 * 1000 // 15 minutes
    })

    url = bucketResponse
    error = null
    success = true
  } catch (err) {
    error = err
    success = true
  }

  return Response.json({ error, success, url })
}