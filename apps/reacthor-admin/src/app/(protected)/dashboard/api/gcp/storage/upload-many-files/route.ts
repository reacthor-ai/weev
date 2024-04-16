import { uploadManyFiles } from '@/clients/gcp'

export async function POST(req: Request) {
  const { files } = await req.json()
  return await uploadManyFiles({ files })
}
