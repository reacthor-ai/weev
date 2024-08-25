import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Handle, Position } from '@xyflow/react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

interface ChatInput {
  key: string
  value: string
}

export const ChatAgentComponent: React.FC<{
  type: 'ChatAgentComponent' | 'ToolsAgentComponent'
}> = ({ type }) => {
  const [name, setName] = useState<string>('Greeter')
  const [agentType, setAgentType] = useState<string>('chat')

  const [chatInputs, setChatInputs] = useState<ChatInput[]>([
    { key: 'agent_name', value: 'Greeter' },
    { key: 'company_name', value: 'Reacthor' }
  ])

  const [llmType, setLlmType] = useState('open-ai')

  const [stateUpdates, setStateUpdates] = useState([
    {
      name: 'UpdateGreetingNode',
      key: 'greet',
      value: true
    }
  ])

  const handleNameChange = (newName: string) => {
    setName(newName)
  }

  const handleAgentTypeChange = (newType: string) => {
    setAgentType(newType)
  }

  const handleAddStateUpdate = () => {
    setStateUpdates([
      ...(stateUpdates as any),
      { name: '', key: '', value: '' }
    ])
  }

  const handleStateUpdateChange = (
    index: number,
    field: string,
    value: any
  ) => {
    const updatedStateUpdates = stateUpdates.map((update, i) =>
      i === index ? { ...update, [field]: value } : update
    )
    setStateUpdates(updatedStateUpdates)
  }

  const handleDeleteChatInput = (index: number) => {
    setChatInputs(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="p-4 rounded-md bg-[#27272a] text-white shadow-md">
      <Handle type="target" position={Position.Top} />
      <h3 className="text-lg font-semibold mb-2">Agent Node</h3>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Agent Name</label>
        <Input
          value={name}
          onChange={e => handleNameChange(e.target.value)}
          className="w-full bg-[#1e1e23] text-white"
          placeholder="Enter agent name"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Agent Type</label>
        <Select value={agentType} onValueChange={handleAgentTypeChange}>
          <SelectTrigger className="bg-[#1e1e23] text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="chat">Chat</SelectItem>
            <SelectItem value="task">Task</SelectItem>
            <SelectItem value="analysis">Analysis</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">LLM Type</label>
        <Select value={llmType} onValueChange={setLlmType}>
          <SelectTrigger className="bg-[#1e1e23] text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="open-ai">OpenAI</SelectItem>
            {/* Add other LLM options here */}
          </SelectContent>
        </Select>
      </div>

      {chatInputs.map((input, index) => (
        <div key={index} className="flex items-center mb-2">
          <Input
            value={input.key}
            onChange={e =>
              setChatInputs(prev =>
                prev.map((item, i) =>
                  i === index ? { ...item, key: e.target.value } : item
                )
              )
            }
            className="w-1/3 mr-2 bg-[#1e1e23] text-white"
            placeholder="Key"
          />
          <Input
            value={input.value}
            onChange={e =>
              setChatInputs(prev =>
                prev.map((item, i) =>
                  i === index ? { ...item, value: e.target.value } : item
                )
              )
            }
            className="w-1/3 mr-2 bg-[#1e1e23] text-white"
            placeholder="Value"
          />
          <Button
            onClick={() => handleDeleteChatInput(index)}
            className="bg-red-500 hover:bg-red-600"
          >
            Delete
          </Button>
        </div>
      ))}

      <Button
        onClick={() => setChatInputs([...chatInputs, { key: '', value: '' }])}
      >
        Add Input
      </Button>

      <div className="mt-4">
        <h4 className="text-md font-semibold mb-2">State Updates</h4>
        {stateUpdates.map((update, index) => (
          <div key={index} className="flex items-center mb-2">
            <Input
              value={update.name}
              onChange={e =>
                handleStateUpdateChange(index, 'name', e.target.value)
              }
              className="w-1/3 mr-2 bg-[#1e1e23] text-white"
              placeholder="Name"
            />
            <Input
              value={update.key}
              onChange={e =>
                handleStateUpdateChange(index, 'key', e.target.value)
              }
              className="w-1/3 mr-2 bg-[#1e1e23] text-white"
              placeholder="Key"
            />
            <Input
              value={update.value as unknown as string}
              onChange={e =>
                handleStateUpdateChange(index, 'value', e.target.value)
              }
              className="w-1/3 bg-[#1e1e23] text-white"
              placeholder="Value"
            />
          </div>
        ))}
        <Button onClick={handleAddStateUpdate}>Add State Update</Button>
      </div>

      <div className="absolute top-5 left-full flex flex-col items-center transform translate-x-3 space-y-4">
        <div className="flex items-center bg-gray-800 p-2 rounded-full shadow-lg hover:bg-gray-700 transition-colors">
          <Handle
            type="target"
            position={Position.Right}
            id="promptConnector"
            style={{
              background: '#f97316',
              borderRadius: '50%',
              height: '12px',
              width: '12px'
            }}
            className="relative"
          />
          <span className="ml-2 mr-2 text-sm text-white font-semibold">
            Prompt
          </span>
        </div>
        {type === 'ToolsAgentComponent' && (
          <div className="flex items-center bg-gray-800 p-2 rounded-full shadow-lg hover:bg-gray-700 transition-colors">
            <Handle
              type="target"
              position={Position.Right}
              id="toolConnector"
              style={{
                background: '#22c55e',
                borderRadius: '50%',
                height: '12px',
                width: '12px'
              }}
              className="relative"
            />
            <span className="ml-2 mr-2 text-sm text-white font-semibold">
              Tool
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
