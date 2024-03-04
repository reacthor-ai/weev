import { atomWithMutation } from 'jotai-tanstack-query'
import { useAtom } from 'jotai'

import type { AtomWithMutationReturn } from '@/store/types'
import { ERROR_MESSAGES } from '@/store/types'

type CreateOrganizationActionAtomParams = {
  clerkId: string
  title: string
}

export const createOrganizationAtom = atomWithMutation(() => ({
  mutationKey: ['createOrganization'],
  mutationFn: async (
    params: CreateOrganizationActionAtomParams
  ): Promise<AtomWithMutationReturn> => {
    try {
      const response = await fetch('/dashboard/organization/api', {
        method: 'POST',
        body: JSON.stringify(params)
      })

      const organization = await response.json()

      if (organization) {
        return {
          status: 'fulfilled',
          result: organization,
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
        error,
        result: null
      }
    }
  }
}))

export const useCreateOrganizationAtom = () => useAtom(createOrganizationAtom)
