'use client'

import { AgentCard } from './AgentCard'
import {
  BookDashedIcon,
  BotIcon,
  GitGraphIcon,
  HammerIcon,
  RouterIcon
} from 'lucide-react'
import { useDndAtom } from '@/store/dnd/create'

export const WorkflowGraphsComponents = () => {
  const [, setDndAtom] = useDndAtom()

  const onDragStart = (event: any, nodeType: any) => {
    setDndAtom(nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <div className="mb-3 dndnode input">
      <div className="grid grid-cols-2">
        <AgentCard
          icon={GitGraphIcon}
          title="Supervisor"
          subtitle="Graph"
          onDragStart={event => onDragStart(event, 'supervisorGraph')}
          draggable
        />
      </div>
    </div>
  )
}

export const WorkflowAgentsComponents = () => {
  const [, setDndAtom] = useDndAtom()

  const onDragStart = (event: any, nodeType: any) => {
    setDndAtom(nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <>
      <div className="mb-3">
        <div className="grid grid-cols-2">
          <AgentCard
            icon={BotIcon}
            title="Tools"
            subtitle="Agent"
            onDragStart={event => onDragStart(event, 'toolAgentComponent')}
            draggable
          />
          <AgentCard
            icon={BotIcon}
            title="General"
            subtitle="Agent"
            onDragStart={event => onDragStart(event, 'chatAgentComponent')}
            draggable
          />
        </div>
      </div>
    </>
  )
}

export const WorkflowPromptsComponents = () => {
  const [, setDndAtom] = useDndAtom()

  const onDragStart = (event: any, nodeType: any) => {
    setDndAtom(nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <>
      <div className="mb-3">
        <div className="grid grid-cols-2">
          <AgentCard
            icon={BookDashedIcon}
            title="General"
            subtitle="Prompt Template"
            onDragStart={event => onDragStart(event, 'promptNode')}
            draggable
          />
        </div>
      </div>
    </>
  )
}

export const WorkflowToolsComponents = () => {
  const [, setDndAtom] = useDndAtom()

  const onDragStart = (event: any, nodeType: any) => {
    setDndAtom(nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <>
      <div className="mb-3">
        <div className="grid grid-cols-2">
          <AgentCard
            icon={HammerIcon}
            title="General State"
            subtitle="Update Tool"
            onDragStart={event => onDragStart(event, 'internalGeneralTool')}
            draggable
          />
        </div>
      </div>
    </>
  )
}

export const WorkflowConditionalRouter = () => {
  const [, setDndAtom] = useDndAtom()

  const onDragStart = (event: any, nodeType: any) => {
    setDndAtom(nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <>
      <div className="mb-3">
        <div className="grid grid-cols-2">
          <AgentCard
            icon={RouterIcon}
            title="Conditional Router"
            subtitle=""
            onDragStart={event => onDragStart(event, 'conditionalRouter')}
            draggable
          />
        </div>
      </div>
    </>
  )
}
