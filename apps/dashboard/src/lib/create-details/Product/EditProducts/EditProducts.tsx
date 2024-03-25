import { BrandVoiceType, ProductType } from '@/database'

type EditProductsProps = {
  brandVoices: BrandVoiceType[]
  clerkId: string
  userId: string,
  organizationId: string
  product: ProductType
}

export const EditProducts = (props: EditProductsProps) => {
  return (
    <div className='min-h-screen p-8'>
      <div className={'mb-4'}>
        <h2 className='text-xl font-semibold'>Edit your your product copywriter</h2>
      </div>
    </div>
  )
}
