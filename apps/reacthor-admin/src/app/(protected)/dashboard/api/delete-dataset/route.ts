import { DeleteDatasetByIdParams, deleteDatasetById } from '@/db/dataset'

export async function POST(req: Request) {
  const params: DeleteDatasetByIdParams = await req.json()
  return await deleteDatasetById(params)
}
