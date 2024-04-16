import { createDataset } from '@/db/dataset'

export async function POST(req: Request) {
  const { title, fileType, dataType } = await req.json()

  return createDataset({ title, fileType, dataType })
}
