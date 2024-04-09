import { BrandVoiceType, ProductType } from '@/database'
import { ProductContent } from '@/lib/create-details/Product/EditProducts/ProductContent'
import { ProductImage } from '@/lib/create-details/Product/EditProducts/ProductImage'

type EditProductsProps = {
  brandVoices: BrandVoiceType[]
  clerkId: string
  userId: string,
  organizationId: string
  product: ProductType
}

export const EditProducts = (props: EditProductsProps) => {
  const { organizationId, userId, clerkId, product, brandVoices } = props
  return (
    <div className='min-h-screen p-8'>
      <div className={'mb-4'}>
        <h2 className='text-xl font-semibold'>Edit your your product copywriter</h2>
      </div>

      <div>

        <ProductContent
          organizationId={organizationId}
          userId={userId}
          clerkId={clerkId}
          projectId={product?.projectId ?? ''}
          brandVoices={brandVoices}
          productId={product.id}
          actionType='update-product'
        />

        <br />
        <br />

        <ProductImage
          clerkId={clerkId}
          userId={userId}
          projectId={product?.projectId ?? ''}
          productId={product.id}
          organizationId={organizationId}
        />
      </div>
    </div>
  )
}
