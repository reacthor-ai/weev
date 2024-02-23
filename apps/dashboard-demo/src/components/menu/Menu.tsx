import { MainNav } from './MainNav'
import { UserNav } from './UserNav'

type MenuProps = {
  children: React.ReactNode
}

export function Menu({ children }: MenuProps) {
  return (
    <>
      <div className="md:hidden border h-screen bg-[#0e1116]"></div>
      <div className="hidden flex-col md:flex">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <MainNav className="mx-6" />
            <div className="ml-auto flex items-center space-x-4">
              <UserNav />
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">
              Choose your Assistant
            </h2>
          </div>

          <div>{children}</div>
        </div>
      </div>
    </>
  )
}
