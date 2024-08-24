import { useAtom } from 'jotai'
import { PromptManagement } from '@prisma/client'
import { createMutationAtom } from '@/store/createMutationAtom'
import { REACTHOR_API_ROUTES } from '@/shared-utils/constant/navigation'

type CreatePromptsActionAtomParams = Pick<
  PromptManagement,
  'title' | 'projectId'
>

export const CreatePromptsAtom = createMutationAtom<
  CreatePromptsActionAtomParams,
  PromptManagement
>('CreatePrompts', REACTHOR_API_ROUTES.CREATE_PROMPTS)

export const useCreatePromptsAtom = () => useAtom(CreatePromptsAtom)
