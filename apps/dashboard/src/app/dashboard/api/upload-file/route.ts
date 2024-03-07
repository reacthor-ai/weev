import { Storage } from '@google-cloud/storage'

export async function POST(req: Request) {
  const { uploadFile, organizationId, userId, fileId, name, fileType } = await req.json()
  let error, success, gcpFileId

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
    await bucket.file(`${organizationId}/${fileName}.txt`).save(uploadFile, {
      contentType: fileType,
      metadata: {
        organizationId,
        userId,
        fileId
      }
    })

    success = true
    gcpFileId = fileName
  } catch (err) {
    error = err
    success = false
  }
  return Response.json({ error, success, gcpFileId })
}