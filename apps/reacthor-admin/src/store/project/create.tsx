import { atomWithMutation } from 'jotai-tanstack-query'
import { useAtom } from 'jotai'
import { ERROR_MESSAGES } from '@/store/types'
import { REACTHOR_API_ROUTES } from '@/shared-utils/constant/navigation'
import { Project } from '@prisma/client'

type CreateProjectActionAtomParams = Pick<Project, 'title' | 'organizationId'>

export const CreateProjectAtom = atomWithMutation(() => ({
  mutationKey: ['CreateProjectAtom'],
  mutationFn: async (params: CreateProjectActionAtomParams) => {
    const body = JSON.stringify(params)
    try {
      const response = await fetch(REACTHOR_API_ROUTES.CREATE_PROJECT, {
        method: 'POST',
        body,
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const result = await response.json()

      if (result) {
        return {
          status: 'fulfilled',
          result,
          error: null
        }
      }

      return {
        status: 'rejected',
        error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
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

export const useCreateProjectAtom = () => useAtom(CreateProjectAtom)
