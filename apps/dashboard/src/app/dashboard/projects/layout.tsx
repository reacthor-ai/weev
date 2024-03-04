import { type ReactNode } from 'react'

type DashboardProjectsLayoutProps = {
  children: ReactNode
}

export default async function DashboardProjectsLayout(
  props: DashboardProjectsLayoutProps
) {
  const { children } = props

  return <>{children}</>
}
