import { atomWithQuery } from 'jotai-tanstack-query'
import { useAtom } from 'jotai'
import { REACTHOR_API_ROUTES } from '@/shared-utils/constant/navigation'
import { ERROR_MESSAGES } from '@/store/types'
import { ReacthorDatastoreType } from '@/db'

type GetListDatasetReturnAtom<T> = {
  status: 'fulfilled' | 'rejected'
  result: { data: T | null }
  error: unknown | null
}

export const getListDatasetAtom = atomWithQuery(() => ({
  queryKey: ['getListDataset'],
  queryFn: async (): Promise<
    GetListDatasetReturnAtom<ReacthorDatastoreType[]>
  > => {
    try {
      const response = await fetch(REACTHOR_API_ROUTES.GET_DATA_SETS, {
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

export const useGetListDatasetAtom = () => useAtom(getListDatasetAtom)
