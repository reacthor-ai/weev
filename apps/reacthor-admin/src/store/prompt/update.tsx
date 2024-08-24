import { useAtom } from 'jotai'
import { PromptManagement } from '@prisma/client'
import { createMutationAtom } from '@/store/createMutationAtom'
import { REACTHOR_API_ROUTES } from '@/shared-utils/constant/navigation'

type UpdatePromptsActionAtomParams = {
  data: Pick<PromptManagement, 'title' | 'template' | 'projectId'>
  promptId: string
}

export const UpdatePromptsAtom = createMutationAtom<
  UpdatePromptsActionAtomParams,
  PromptManagement
>('UpdatePrompt', REACTHOR_API_ROUTES.UPDATE_PROMPT)

export const useUpdatePromptsAtom = () => useAtom(UpdatePromptsAtom)
