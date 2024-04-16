import { atomWithMutation } from 'jotai-tanstack-query'
import { useAtom } from 'jotai'
import { REACTHOR_API_ROUTES } from '@/shared-utils/constant/navigation'
import { ERROR_MESSAGES } from '@/store/types'
import { CreateDatasetParams } from '@/db/dataset'

type CreateDatasetActionAtomParams = CreateDatasetParams;

export const CreateDatasetAtom = atomWithMutation(() => ({
  mutationKey: ['CreateDatasetAtom'],
  mutationFn: async (params: CreateDatasetActionAtomParams) => {
    const body = JSON.stringify(params);
    try {
      const response = await fetch(REACTHOR_API_ROUTES.CREATE_DATA_SET, {
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

export const useCreateDatasetAtom = () => useAtom(CreateDatasetAtom)