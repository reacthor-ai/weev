import { Storage } from '@google-cloud/storage'

export async function POST(req: Request) {
  const data = await req.formData()
  const file: File | null = data.get('file') as unknown as File

  let error, success, gcpFileId

  const organizationId = data.get('org-id')
  const fileId = data.get('file-id')
  const name = data.get('name')
  const userId = data.get('user-id')

  const storage = new Storage({
    projectId: process.env.PROJECT_ID,
    credentials: {
      client_email: process.env.CLIENT_EMAIL,
      private_key: process.env.PRIVATE_KEY
    }
  })

  const bucket = storage.bucket(process.env.BUCKET_NAME as string)
  const fileName = `${name}-${fileId}`

  try {
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const blob = bucket.file(`${organizationId}/${fileName}.png`)
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

  return Response.json({ error, success, gcpFileId })
}