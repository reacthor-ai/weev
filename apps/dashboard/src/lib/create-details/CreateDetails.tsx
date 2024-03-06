import { ProductCreateDetails } from '@/lib/create-details/Product'
import { EditProducts } from '@/lib/create-details/Product/EditProducts'
import { CreateImageDetails } from '@/lib/create-details/Product/CreateImage'

type CreateDetailsProps = {
  create: 'product' | 'edit-product' | 'create-image'
}

export const CreateDetails = (props: CreateDetailsProps) => {
  const { create } = props

  const createDetails = {
    product: <ProductCreateDetails />,
    'edit-product': <EditProducts />,
    'create-image': <CreateImageDetails />
  } as const satisfies Record<
    'product' | 'edit-product' | 'create-image',
    JSX.Element
  >

  return createDetails[create]
}
