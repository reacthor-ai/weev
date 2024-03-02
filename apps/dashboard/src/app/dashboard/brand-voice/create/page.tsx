import { PageHeader } from '@/components/PageHeader'
import { CreateDetails } from '@/lib/create-details'

export default function DashboardCreateBrandVoice() {
  return (
    <>
      <PageHeader
        title={'Create Brand Voice'}
        subTitle={''}
        content={''}
        enableBackBtn
      >
        <div className='mt-8'>
          <CreateDetails create={'brand-voice'} />
        </div>
      </PageHeader>
    </>
  )
}
