import { atomWithMutation } from 'jotai-tanstack-query'
import { useAtom } from 'jotai'
import { generateProductWithAI, type UniqueVoiceParams } from '@/store/ai/api/generateProduct'
import { createPlaceholderProduct } from '@/store/ai/api/createPlaceholderProduct'

type GenerateAiProductAtomParams = UniqueVoiceParams & {
  brandVoiceId: string
  projectId: string
}

export const generateGenerateAiProductAtom = atomWithMutation(() => ({
  mutationKey: ['generateGenerateAiProduct'],
  mutationFn: async (params: GenerateAiProductAtomParams) => {

    try {

      const generatedProduct = await generateProductWithAI({
        clerkId: params.clerkId,
        model_id: params.model_id,
        image: {
          prompt: params.image.prompt,
          url: params.image.url
        },
        brand_voice: params.brand_voice,
        marketing_requirements: params.marketing_requirements,
        extraGenInfo: params.extraGenInfo
      })

      const productInfo = JSON.parse(generatedProduct.message.product_info.messages.product_info.messages.trim().replace('json', '').replace('\\', '').replaceAll('\n', '').replaceAll('`', ''))

      const placeholderProduct = await createPlaceholderProduct({
        prompt: {
          text: params.marketing_requirements,
          image: params.image.prompt
        },
        projectId: params.projectId,
        brandVoiceId: params.brandVoiceId,
        src: generatedProduct?.message?.image_info?.id,
        title: productInfo.product_title ?? '',
        description: productInfo.product_description
      })


      if (placeholderProduct) {
        return {
          status: 'fulfilled',
          result: placeholderProduct,
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
  }
}))

export const useGenerateAiProductAtom = () => useAtom(generateGenerateAiProductAtom)