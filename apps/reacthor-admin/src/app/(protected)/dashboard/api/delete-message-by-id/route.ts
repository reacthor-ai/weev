import { deleteMessagingById, DeleteMessagingByIdParams } from '@/db/messaging'

export async function POST(req: Request) {
  const params: DeleteMessagingByIdParams = await req.json()
  return await deleteMessagingById(params)
}
