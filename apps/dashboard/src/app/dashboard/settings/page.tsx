import { SignOutButton } from '@clerk/nextjs'
import { PageHeader } from '@/components/PageHeader'

export default function DashboardSettings() {
  return (
    <PageHeader
      title={'Settings'}
      subTitle={'Manage your Account'}
      content={''}>
      <SignOutButton />
    </PageHeader>
  )
}
