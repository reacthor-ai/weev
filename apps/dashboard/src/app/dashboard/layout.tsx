import { type ReactNode } from 'react'
import { Menu } from '@/components/Menu'
import { Container } from '@/components/ui/container'

type AppStoreLayoutProps = {
  children: ReactNode
}

export default function DashboardLayout(props: AppStoreLayoutProps) {
  const { children } = props
  return (
    <Container>
      <Menu
        childrenWithTabs={children}
      />
    </Container>
  )
}