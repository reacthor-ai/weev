import { bucket } from '@/api-utils/gcp/storage'

export const getGCPFile = async (fileName: string, expires: string | number | Date) => {
  let error, success, url

  try {
    const [bucketResponse] = await bucket.file(fileName).getSignedUrl({
      version: 'v4',
      action: 'write',
      expires
    })

    url = bucketResponse
    error = null
    success = true
  } catch (err) {
    error = err
    success = true
  }

  return Promise.resolve({ url, error, success })
}