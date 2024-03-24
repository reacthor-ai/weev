import { PageHeader } from '@/components/PageHeader'
import { KnowledgeHub } from '@/lib/knowledge-hub/KnowledgeHub'
import { getBrandVoicesByOrgId } from '@/database/brand'
import { redirect } from 'next/navigation'
import { NAVIGATION } from '@/shared-utils/constant/navigation'
import { Suspense } from 'react'

export default async function DashboardChat() {
  const brandVoices = await getBrandVoicesByOrgId()

  if (!brandVoices) {
    redirect(NAVIGATION.BRAND_VOICE_CREATE)
  }

  return (
    <>
      <PageHeader
        title={'Knowledge Hub'}
        subTitle={''}
        content={''}
      >
        <Suspense fallback={'Loading...'}>
          <div className='min-h-screen my-8'>
            <KnowledgeHub brandVoices={brandVoices} />
          </div>
        </Suspense>
        <div className='mt-[8rem]' />
      </PageHeader>
    </>
  )
}
