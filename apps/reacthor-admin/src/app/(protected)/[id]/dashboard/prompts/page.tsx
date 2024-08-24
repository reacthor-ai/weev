import { PageHeader } from '@/components/PageHeader/PageHeader'
import { ListPrompts } from '@/lib/prompts'

export default function DashboardPromptsPage() {
  return (
    <PageHeader title={'Prompts'}>
      <ListPrompts />{' '}
    </PageHeader>
  )
}
