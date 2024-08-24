import { atom, useAtom } from 'jotai'
import type { Organization, Project, User } from '@prisma/client'
import { createQueryAtom } from '@/store/createQueryAtom'
import { REACTHOR_API_ROUTES } from '@/shared-utils/constant/navigation'

type CreateUserAtomReturn = {
  user: User
  organization: Organization & { projects: Project[] }
}

export const clerkIdAtom = atom<string>('')

export const GetUserAtom = createQueryAtom<string, CreateUserAtomReturn>(
  'getUserByIdAtom',
  REACTHOR_API_ROUTES.GET_USER_BY_CLERK_ID,
  clerkIdAtom,
  clerkId => ({
    clerkId
  })
)

export const updateClerkIdAtom = () => useAtom(clerkIdAtom)

export const useGetUserAtom = () => useAtom(GetUserAtom)
