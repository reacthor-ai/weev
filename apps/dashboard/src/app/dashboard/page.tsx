import { PageHeader } from '@/components/PageHeader'
import { Showcase } from '@/components/Showcase/Showcase'

export default function DashboardHome() {
  return (
    <>
      <PageHeader
        title={'Home'}
        subTitle={'Get Started'}
        content={'Create your companies personal branding using your personal AI tool.'}>
        <div className='mt-8'>
          <Showcase />
        </div>
      </PageHeader>
    </>
  )
}
