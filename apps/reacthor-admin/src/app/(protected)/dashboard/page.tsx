import { PageHeader } from '@/components/PageHeader/PageHeader'
import { Home } from '@/lib/home/Home'

export default function DashboardHome() {
  return (
    <PageHeader title={'Projects & Automation'}>
      <Home />
    </PageHeader>
  )
}
