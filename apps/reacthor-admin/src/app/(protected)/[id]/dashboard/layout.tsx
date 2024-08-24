import { type ReactNode } from 'react'
import { Menu } from '@/components/Menu'
import { Container } from '@/components/ui/container'
import { Toaster } from 'sonner'

type DashboardLayoutProps = {
  children: ReactNode
}

export default function DashboardLayout(props: DashboardLayoutProps) {
  const { children } = props

  return (
    <Container>
      <Toaster />
      <Menu>{children}</Menu>
    </Container>
  )
}
