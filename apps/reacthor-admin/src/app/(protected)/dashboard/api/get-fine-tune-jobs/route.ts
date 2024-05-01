import { NextRequest } from 'next/server'
import { fineTuneList } from '@/clients/openai/fineTuneList'

export async function GET(request: NextRequest) {
  const _ = request.nextUrl.searchParams
  return Response.json(await fineTuneList())
}
