import { atom, useAtom } from 'jotai'
import { REACTHOR_API_ROUTES } from '@/shared-utils/constant/navigation'
import { PromptManagement } from '@prisma/client'
import { createQueryAtom } from '@/store/createQueryAtom'

export const projectIdAtom = atom<string>('')

export const GetProjectPromptById = createQueryAtom<string, PromptManagement[]>(
  'getProjectPromptById',
  REACTHOR_API_ROUTES.LIST_PROMPTS,
  projectIdAtom,
  projectId => ({ projectId })
)

export const updateProjectPromptsByIdAtom = () => useAtom(projectIdAtom)

export const useGetProjectPromptsByAtom = () => useAtom(GetProjectPromptById)
