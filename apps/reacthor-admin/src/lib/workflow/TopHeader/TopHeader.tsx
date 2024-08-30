'use client'

import { ButtonDefault } from '@/components/ui/button'
import { PlayIcon, RocketIcon } from '@radix-ui/react-icons'
import { useAgents } from '@/store/workflow/agents/agents'
import { useWorkflow } from '@/store/workflow/graph/graph'

type TopHeaderProps = {
  title: string
}

export function TopHeader({ title }: TopHeaderProps) {
  const agents = useAgents()
  const { workflows } = useWorkflow()
  console.log({ agents, workflows })
  return (
    <header className="p-[2rem] flex h-[52px] bg-[#17171c] items-center gap-4 border-b border-b-[#27272a] px-4 md:px-6">
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <h3 className="text-lg">{title}</h3>
      </div>

      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <form className="ml-auto flex-1 sm:flex-initial">
          <div className="relative flex">
            <ButtonDefault
              className="mr-4"
              defaultStyles
              icon={<PlayIcon className="mr-2" />}
              title="Run"
            />
            <ButtonDefault
              icon={<RocketIcon className="mr-2" />}
              title="Deploy"
              className="bg-[#e11d48] text-white hover:bg-white hover:text-black"
            />
          </div>
        </form>
      </div>
    </header>
  )
}
