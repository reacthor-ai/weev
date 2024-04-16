import { NextRequest } from 'next/server'
import { listDataset } from '@/db/dataset'

export async function GET(request: NextRequest) {
  const _ = request.nextUrl.searchParams
  return listDataset()
}