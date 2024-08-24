import { type ReactNode } from 'react'
import { Container } from '@/components/ui/container'
import { Toaster } from 'sonner'

type ProjectsLayoutProps = {
  children: ReactNode
}

export default async function ProjectsLayout(props: ProjectsLayoutProps) {
  const { children } = props

  return (
    <Container>
      <Toaster />
      {children}
    </Container>
  )
}
