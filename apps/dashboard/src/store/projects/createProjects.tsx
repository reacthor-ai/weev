import { atomWithMutation } from 'jotai-tanstack-query'
import { useAtom } from 'jotai'
import { AtomWithMutationReturn, ERROR_MESSAGES } from '@/store/types'

type CreateProjectsActionAtomParams = {
  organizationId: string
  clerkId: string
  project: {
    title: string
    description: string
  }
}

export const createProjectsAtom = atomWithMutation(() => ({
  mutationKey: ['createProjects'],
  mutationFn: async (
    params: CreateProjectsActionAtomParams
  ): Promise<AtomWithMutationReturn> => {
    try {
      const response = await fetch('/dashboard/projects/api', {
        method: 'POST',
        body: JSON.stringify({
          ...params,
          title: params.project.title,
          description: params.project.description
        })
      })

      const createProjects = await response.json()

      if (createProjects) {
        return {
          status: 'fulfilled',
          result: createProjects,
          error: null
        }
      }

      return {
        status: 'rejected',
        error: ERROR_MESSAGES.CREATE_ORGANIZATION_ERROR,
        result: null
      }
    } catch (error) {
      return {
        status: 'rejected',
        result: null,
        error: error
      }
    }
  }
}))

export const useCreateProjectsAtom = () => useAtom(createProjectsAtom)
