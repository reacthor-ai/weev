import { atom, useAtom, useSetAtom } from 'jotai'
import { REACTHOR_API_ROUTES } from '@/shared-utils/constant/navigation'
import { PromptManagement } from '@prisma/client'
import { createQueryAtom } from '@/store/createQueryAtom'

export const promptIdAtom = atom<string>('')

export const GetPromptIdAtom = createQueryAtom<string, PromptManagement>(
  'getPromptIdAtom',
  REACTHOR_API_ROUTES.GET_PROMPT,
  promptIdAtom,
  promptId => ({ promptId })
)

export const useUpdatePromptByIdAtom = () => useSetAtom(promptIdAtom)

export const useGetPromptByIdAtom = () => useAtom(GetPromptIdAtom)
