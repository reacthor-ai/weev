import { PageHeader } from '@/components/PageHeader'
import { Products } from '@/components/Products'
import { NAVIGATION } from '@/shared-utils/constant/navigation'
import { getUniqueProjects } from '@/database/projects'
import { Suspense } from 'react'

export default async function DashboardProjectDetails(props: any) {
  const { id } = props.params
  const project = await getUniqueProjects({
    id
  })

  return (
    <>
      <PageHeader
        title={'View Projects'}
        subTitle={project?.details.title ?? ''}
        content={
          project?.details.description ?? ''
        }
        btnTitle='New Product'
        btnLink={`${NAVIGATION.PROJECT_DETAILS}/${id}/create-product`}
        enableBackBtn
      >
        <Suspense fallback='Loading...'>
          <div className='my-8 scroll-auto'>
            {!project?.products || project?.products.length === 0 ? (
              <>No products available!</>
            ) : (
              <Products products={project.products} productId={id} />
            )}
            <div className='mt-[12rem]' />
          </div>
        </Suspense>
      </PageHeader>
    </>
  )
}
