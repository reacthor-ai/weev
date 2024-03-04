import { type ReactNode } from 'react'
import { Menu } from '@/components/Menu'
import { Container } from '@/components/ui/container'
import { getUser } from '@/database/user'
import { OrganizationCreateDetails } from '@/lib/create-details/Organization'

export const revalidate = 3600 // revalidate the data at most every hour

type DashboardLayoutProps = {
  children: ReactNode
}

export default async function DashboardLayout(props: DashboardLayoutProps) {
  const { children } = props

  /**
   * Initialize user
   */
  const user = await getUser()

  if (user.organization.length === 0) {
    return <OrganizationCreateDetails id={user.clerkId} />
  }

  return (
    <Container>
      <Menu childrenWithTabs={children} />
    </Container>
  )
}
