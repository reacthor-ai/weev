import { atomWithMutation } from 'jotai-tanstack-query'
import { ERROR_MESSAGES } from '@/store/types'

type MutationResult<R> = {
  status: 'fulfilled' | 'rejected'
  result: R | null
  error: Error | null
}

export const createMutationAtom = <T, R>(
  key: string,
  endpoint: string,
  method: 'POST' | 'PUT' | 'DELETE' | 'PATCH' = 'POST'
) => {
  return atomWithMutation(() => ({
    mutationKey: [key],
    mutationFn: async (params: T): Promise<MutationResult<R>> => {
      const body = JSON.stringify(params)
      try {
        const response = await fetch(endpoint, {
          method,
          body,
          headers: {
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          return {
            status: 'rejected',
            result: null,
            error: new Error(ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
          }
        }

        const result = await response.json()
        return {
          status: 'fulfilled',
          result,
          error: null
        }
      } catch (error) {
        console.error(`Error in ${key} mutation:`, error)
        return {
          status: 'rejected',
          result: null,
          error: error instanceof Error ? error : new Error(String(error))
        }
      }
    }
  }))
}
