import { PageHeader } from '@/components/PageHeader'
import { Products } from '@/components/Products'
import { NAVIGATION } from '@/shared-utils/constant/navigation'

export default function DashboardProjectDetails(params: any) {
  const id = params?.id

  return (
    <>
      <PageHeader
        title={'View Projects'}
        subTitle={'March Catalogue'}
        content={'Enhance user experience by incorporating user feedback and conducting usability testing.'}
        btnTitle='New Product'
        btnLink={`${NAVIGATION.PROJECT_DETAILS}/${id}/create`}
        enableBackBtn
      >
        <div className='mt-8'>
          <Products productId={id} />
        </div>
      </PageHeader>
    </>
  )
}
