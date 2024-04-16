import { createUser } from '@/db/user'

export async function POST(req: Request) {
  const { organizationTitle } = await req.json()

  return createUser({organizationTitle})
}