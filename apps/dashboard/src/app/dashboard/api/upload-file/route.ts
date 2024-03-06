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
  const fileName = `${name}-${organizationId}-${fileId}`

  if (fileType === 'text/plain') {
    try {
      await bucket.file(`${fileName}.txt`).save(uploadFile, {
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

  // most likely an image
  else {
    try {
      // Assuming `file` is the binary data of the image, and `fileName` is how you want to name the file in GCP.
      const blob = bucket.file(`${fileName}.png`)
      const stream = blob.createWriteStream({
        metadata: {
          contentType: fileType, // Ensure you have the correct MIME type
          metadata: {
            organizationId,
            userId,
            fileId
          }
        }
      })

      stream.on('error', (err) => {
        console.error('Stream error:', err)
      })

      stream.on('finish', async () => {
        // File uploaded successfully
        success = true
        gcpFileId = fileName
      })

      stream.end(uploadFile)
    } catch (err) {
      error = err
      success = false
    }
    return Response.json({ error, success, gcpFileId })
  }
}