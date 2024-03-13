import { atomWithQuery } from 'jotai-tanstack-query'
import { atom, useAtom } from 'jotai'
import { getUniqueGenerationById } from '@/store/ai/api/getImageGeneration'

export const generatedImageAtom = atom<Array<{ src: string, id?: string }>>([])

export const getUniqueGenImageAtom = atomWithQuery((get) => ({
  queryKey: ['getUniqueGenImage', get(generatedImageAtom)],
  queryFn: async ({ queryKey: [, image_id] }) => {
    (image_id as Array<{ src?: string, id: string }>)?.map(async value => {
      try {
        const uniqueGenImage = await getUniqueGenerationById({ image_id: value.id, clerkId: '' })

        if (uniqueGenImage) {
          return {
            status: 'fulfilled',
            result: uniqueGenImage,
            error: null
          }
        }

      } catch (error) {
        return {
          status: 'rejected',
          result: null,
          error: error
        }
      }
    })
  }
}))

export const useGetUniqueGenImageAtom = () => useAtom(getUniqueGenImageAtom)

export const useUpdateGenImageAtom = () => useAtom(generatedImageAtom)