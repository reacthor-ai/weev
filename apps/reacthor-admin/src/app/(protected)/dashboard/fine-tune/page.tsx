import { FineTune } from '@/lib/fine-tune'
import { PageHeader } from '@/components/PageHeader/PageHeader'

export default function DashboardFinetune() {
  return (
    <PageHeader title={'Fine tuning'}>
      <FineTune />
    </PageHeader>
  )
}
