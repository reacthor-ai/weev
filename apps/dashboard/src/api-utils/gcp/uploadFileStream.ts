import { bucket } from '@/api-utils/gcp/storage'

export const uploadFileStream = async (file: File, fileName: string) => {
  let error, success, gcpFileId

  try {
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const blob = bucket.file(fileName)
    const stream = blob.createWriteStream({
      resumable: false,
      contentType: file.type
    })

    stream.on('error', (err) => {
      return Response.json({ error: err.cause, success: false })
    })

    stream.on('finish', () => {
      success = true
      gcpFileId = fileName
    })

    success = true
    gcpFileId = fileName
    error = null

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