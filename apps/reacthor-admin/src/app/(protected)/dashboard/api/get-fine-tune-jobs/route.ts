import { NextRequest } from 'next/server'
import { listFinetune } from '@/db/fine-tune'

export async function GET(request: NextRequest) {
  const _ = request.nextUrl.searchParams
  return listFinetune()
}
