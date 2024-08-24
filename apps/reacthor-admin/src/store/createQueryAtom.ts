import { atomWithQuery } from 'jotai-tanstack-query'
import { ERROR_MESSAGES } from '@/store/types'
import { PrimitiveAtom } from 'jotai'

export type WithInitialValue<Value> = {
  init: Value
}

type GetReturnAtom<T> = {
  status: 'fulfilled' | 'rejected'
  result: { data: T | null; error: T | null }
  error: unknown | null
}

type QueryParams = Record<string, string | number | boolean>

export const createQueryAtom = <T, E>(
  key: string,
  endpoint: string,
  atom: PrimitiveAtom<T> & WithInitialValue<T>,
  paramsBuilder: (value: T) => QueryParams
) => {
  return atomWithQuery(get => {
    const atomValue = get(atom)
    const queryParams = paramsBuilder(atomValue)
    const queryKey = [key, queryParams]

    return {
      queryKey,
      queryFn: async ({ queryKey: [, params] }): Promise<GetReturnAtom<E>> => {
        const searchParams = new URLSearchParams()
        Object.entries(params as QueryParams).forEach(([key, value]) => {
          searchParams.append(key, String(value))
        })

        const url = `${endpoint}?${searchParams.toString()}`

        try {
          const response = await fetch(url, {
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
            result: { data: null, error: null }
          }
        } catch (error) {
          return {
            status: 'rejected',
            result: { data: null, error: null },
            error: error
          }
        }
      }
    }
  })
}
