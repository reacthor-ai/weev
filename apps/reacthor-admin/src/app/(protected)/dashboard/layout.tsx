import { type ReactNode } from 'react'
import { Menu } from '@/components/Menu'
import { Container } from '@/components/ui/container'
import { getUser } from '@/db/user'
import { CreateOrganization } from '@/lib/organization/CreateOrganization'

type DashboardLayoutProps = {
  children: ReactNode
}

export default async function DashboardLayout(props: DashboardLayoutProps) {
  const { children } = props

  const user = await getUser()

  if (!user) {
    return (
      <Container>
        <Menu>
          <CreateOrganization />
        </Menu>
      </Container>
    )
  }

  return (
    <Container>
      <Menu>{children}</Menu>
    </Container>
  )
}
