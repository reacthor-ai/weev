import { PickTransactionMessaging } from '@/db/bucket'
import { mergeCSVFiles } from '@/clients/gcp'

export async function POST(req: Request) {
  const params: PickTransactionMessaging = await req.json()
  return await mergeCSVFiles(params)
}
