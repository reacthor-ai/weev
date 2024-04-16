import {
  createGCPBucketStoreRag,
  type CreateGCPBucketStoreRagParams
} from '@/db/bucket'

export async function POST(req: Request) {
  const params: CreateGCPBucketStoreRagParams = await req.json()
  return await createGCPBucketStoreRag(params)
}
