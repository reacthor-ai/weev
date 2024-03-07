import { EditProducts } from '@/lib/create-details/Product/EditProducts'
import { CreateImageDetails } from '@/lib/create-details/Product/CreateImage'

type CreateDetailsProps = {
  create: 'edit-product' | 'create-image'
}

export const CreateDetails = (props: CreateDetailsProps) => {
  const { create } = props

  const createDetails = {
    'edit-product': <EditProducts />,
    'create-image': <CreateImageDetails />
  } as const satisfies Record<
    'edit-product' | 'create-image',
    JSX.Element
  >

  return createDetails[create]
}
