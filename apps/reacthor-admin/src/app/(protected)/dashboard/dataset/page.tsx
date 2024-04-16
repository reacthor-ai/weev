import { PageHeader } from '@/components/PageHeader/PageHeader'
import { Dataset } from '@/lib/dataset'

export const revalidate = 3600 // revalidate the data at most every hour

export default async function DashboardDataset() {
  return (
    <PageHeader title={'Dataset'}>
      <Dataset />
    </PageHeader>
  )
}
