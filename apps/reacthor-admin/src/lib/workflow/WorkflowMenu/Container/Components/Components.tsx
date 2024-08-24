'use client'

import { AgentCard } from './AgentCard'
import { BookDashedIcon, BotIcon, GitGraphIcon, HammerIcon } from 'lucide-react'

type WorkflowComponentProps = {
  /*  */
}

export const WorkflowGraphsComponents = () => {
  return (
    <div className="mb-3">
      <div className="grid grid-cols-2">
        <AgentCard icon={GitGraphIcon} title="Supervisor" subtitle="Graph" />
      </div>
    </div>
  )
}

export const WorkflowAgentsComponents = () => {
  return (
    <>
      <div className="mb-3">
        <div className="grid grid-cols-2">
          <AgentCard icon={BotIcon} title="Tools" subtitle="Agent" />
          <AgentCard icon={BotIcon} title="General" subtitle="Agent" />
        </div>
      </div>
    </>
  )
}

export const WorkflowPromptsComponents = () => {
  return (
    <>
      <div className="mb-3">
        <div className="grid grid-cols-2">
          <AgentCard
            icon={BookDashedIcon}
            title="General"
            subtitle="Prompt Template"
          />
        </div>
      </div>
    </>
  )
}

export const WorkflowToolsComponents = () => {
  return (
    <>
      <div className="mb-3">
        <div className="grid grid-cols-2">
          <AgentCard
            icon={HammerIcon}
            title="General State"
            subtitle="Update Tool"
          />
        </div>
      </div>
    </>
  )
}

export const WorkflowComponent = (props: WorkflowComponentProps) => {
  return <div className="">hello, world</div>
}
