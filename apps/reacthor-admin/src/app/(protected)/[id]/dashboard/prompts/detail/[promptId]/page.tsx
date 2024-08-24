import { PageHeader } from '@/components/PageHeader/PageHeader'
import { PromptDetail } from '@/lib/prompts/PromptDetail'

export default function DashboardPromptsDetailPage() {
  return (
    <PageHeader title={'Prompts Detail'}>
      <PromptDetail />
    </PageHeader>
  )
}
