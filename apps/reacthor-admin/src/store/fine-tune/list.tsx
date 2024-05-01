import { atomWithQuery } from 'jotai-tanstack-query'
import { useAtom } from 'jotai'
import { REACTHOR_API_ROUTES } from '@/shared-utils/constant/navigation'
import { ERROR_MESSAGES } from '@/store/types'
import { ReturnFinetuneList } from '@/clients/openai/fineTuneList'

type GetListFinetuneJobReturnAtom<T> = {
  status: 'fulfilled' | 'rejected'
  result: { data: T | null }
  error: unknown | null
}

export const getListFineTuneJobAtom = atomWithQuery(() => ({
  queryKey: ['getListFineTuneJob'],
  queryFn: async (): Promise<
    GetListFinetuneJobReturnAtom<ReturnFinetuneList[]>
  > => {
    try {
      const response = await fetch(REACTHOR_API_ROUTES.GET_LIST_FINE_TUNE_JOB, {
        next: { revalidate: 3600 },
        method: 'GET',
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
        result: { data: null }
      }
    } catch (error) {
      return {
        status: 'rejected',
        result: { data: null },
        error: error
      }
    }
  }
}))

export const useGetListFineTuneJobAtomAtom = () =>
  useAtom(getListFineTuneJobAtom)
