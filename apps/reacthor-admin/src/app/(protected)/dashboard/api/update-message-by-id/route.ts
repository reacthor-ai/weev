import {
  updateMessageContentById,
  UpdateMessageContentByIdParams
} from '@/db/messaging'

export async function POST(req: Request) {
  const params: UpdateMessageContentByIdParams = await req.json()

  return await updateMessageContentById(params)
}
