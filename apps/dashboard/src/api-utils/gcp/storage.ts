import { Storage } from '@google-cloud/storage'

export const gcpStorage = new Storage({
  projectId: process.env.PROJECT_ID,
  credentials: {
    client_email: process.env.CLIENT_EMAIL,
    private_key: process.env.PRIVATE_KEY
  }
})

export const bucket = gcpStorage.bucket(process.env.BUCKET_NAME as string)

