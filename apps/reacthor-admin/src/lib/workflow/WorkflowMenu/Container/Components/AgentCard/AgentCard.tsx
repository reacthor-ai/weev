import React from 'react'
import { cn } from '@/lib/utils'

type AgentCardProps = {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  title: string
  subtitle: string
  className?: string
  onDragStart: (
    event: React.DragEvent<HTMLDivElement>,
    nodeType: string
  ) => void
  draggable: boolean // Add draggable prop
}

export const AgentCard: React.FC<AgentCardProps> = ({
  icon: Icon,
  title,
  subtitle,
  className,
  onDragStart,
  draggable
}) => {
  const baseClasses = 'flex flex-col text-center items-center cursor-pointer'
  return (
    <div className={cn(baseClasses, className)}>
      <div
        onDragStart={event => onDragStart(event, 'promptNode')}
        draggable={draggable}
        className="flex flex-col items-center space-y-2 p-3 bg-[#27272a] rounded-xl"
      >
        <div className="flex items-center justify-center w-6 h-6 bg-[#17171c] rounded-md">
          <Icon className="w-4 h-4 text-white" />
        </div>
      </div>
      <div className="text-center mt-2">
        <p className="text-sm font-medium text-white">
          {title}
          <br />
          {subtitle}
        </p>
      </div>
    </div>
  )
}
