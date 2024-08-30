import { EdgeProps, Handle, Position } from '@xyflow/react'
import { useNodeId } from '@/hooks/useNodeId'
import { GitGraphIcon } from 'lucide-react'

export const SupervisorGraph: React.FC<EdgeProps> = props => {
  const { id } = props
  const supervisorToChatAgentId = useNodeId(id)

  return (
    <div className="border border-gray-700 hover:shadow-lg w-full rounded-lg p-5 bg-[#27272a] text-white">
      <div className="flex flex-col justify-between items-center">
        <div className="my-2">
          <GitGraphIcon />
        </div>
        <div className="text-lg font-semibold">Supervisor Graph</div>
      </div>

      {/* Handle connection */}
      <div className="absolute mr-4 top-0 left-full flex flex-col items-center transform translate-x-3 space-y-4">
        <div className="flex items-center bg-gray-800 p-2 rounded-full shadow-lg hover:bg-gray-700 transition-colors">
          <Handle
            type="target"
            id={'agentgraph_' + supervisorToChatAgentId}
            position={Position.Right}
            style={{
              background: '#f97316',
              borderRadius: '50%',
              height: '12px',
              width: '12px'
            }}
            className="relative"
            isConnectable
          />
          <span className="ml-2 mr-2 text-sm text-white font-semibold">
            Agent
          </span>
        </div>
      </div>

      <div className="absolute mt-14 mr-4 top-0 left-full flex flex-col items-center transform translate-x-3 space-y-4">
        <div className="flex items-center bg-gray-800 p-2 rounded-full shadow-lg hover:bg-gray-700 transition-colors">
          <Handle
            type="target"
            id={'condition_' + supervisorToChatAgentId}
            position={Position.Right}
            style={{
              background: '#ffd580',
              borderRadius: '50%',
              height: '12px',
              width: '12px'
            }}
            className="relative"
            isConnectable
          />
          <span className="ml-2 mr-2 text-sm text-white font-semibold">
            Condition
          </span>
        </div>
      </div>
    </div>
  )
}
