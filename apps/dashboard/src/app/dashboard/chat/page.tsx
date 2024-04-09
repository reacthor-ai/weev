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
      <Suspense fallback={'Loading...'}>
        <KnowledgeHub brandVoices={brandVoices} />
      </Suspense>
    </>
  )
}
