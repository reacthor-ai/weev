'use client'

import React, { useCallback, useMemo, useState } from 'react'
import { Button, ButtonDefault } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { EdgeProps, Handle, Position } from '@xyflow/react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { XIcon } from 'lucide-react'
import { useNodeId } from '@/hooks/useNodeId'
import { useAgents, useUpdateAgent } from '@/store/workflow/agents/agents'

interface StateUpdate {
  name: string
  _state: Record<string, boolean | string | number>
  tools: any[]
}

interface ChatAgentComponentProps {
  type: 'tools' | 'general'
}

export const ChatAgentComponent: React.FC<
  EdgeProps & ChatAgentComponentProps
> = ({ id, type }) => {
  const chatAgentToPromptId = useNodeId(id)
  const toolsAgentToPromptId = useNodeId(id)
  const agentToGraphId = useNodeId(id)

  const agents = useAgents()
  const updateAgent = useUpdateAgent()

  const [llmType, setLlmType] = useState('ChatOpenAI')
  const [stateUpdates, setStateUpdates] = useState<StateUpdate[]>([
    {
      name: 'UpdateAgentNodeName',
      _state: {
        greet: true
      },
      tools: []
    }
  ])

  const newType =
    type === 'tools' ? 'ToolsAgentComponent' : 'ChatAgentComponent'

  const handleUpdateAgent = useCallback(() => {
    updateAgent({
      name: id,
      type: newType,
      llm: {
        type: llmType as any,
        model: 'gpt-4o-mini',
        max_retries: 2
      },
      state_updates: stateUpdates,
      promptId: undefined
    })
  }, [id, llmType, stateUpdates, updateAgent, agents])

  const handleAddStateUpdate = useCallback(() => {
    setStateUpdates(prev => [...prev, { name: '', _state: {}, tools: [] }])
  }, [])

  const handleStateUpdateChange = useCallback(
    (index: number, field: string, value: any) => {
      setStateUpdates(prev =>
        prev.map((update, i) =>
          i === index ? { ...update, [field]: value } : update
        )
      )
    },
    []
  )

  const handleStateKeyChange = useCallback(
    (index: number, key: string, value: boolean | string | number) => {
      setStateUpdates(prev =>
        prev.map((update, i) =>
          i === index
            ? { ...update, _state: { ...update._state, [key]: value } }
            : update
        )
      )
    },
    []
  )

  const handleAddStateKey = useCallback((index: number) => {
    setStateUpdates(prev =>
      prev.map((update, i) =>
        i === index
          ? {
              ...update,
              _state: {
                ...update._state,
                [`newKey${Object.keys(update._state).length}`]: true
              }
            }
          : update
      )
    )
  }, [])

  const handleDeleteStateKey = useCallback(
    (updateIndex: number, keyToDelete: string) => {
      setStateUpdates(prev =>
        prev.map((update, i) =>
          i === updateIndex
            ? {
                ...update,
                _state: Object.fromEntries(
                  Object.entries(update._state).filter(
                    ([key]) => key !== keyToDelete
                  )
                )
              }
            : update
        )
      )
    },
    []
  )

  const handleDeleteStateUpdate = useCallback((index: number) => {
    setStateUpdates(prev => prev.filter((_, i) => i !== index))
  }, [])

  const title = useMemo(
    () => ({
      tools: 'Tools Agent Node',
      general: 'General Agent Node'
    }),
    []
  )

  return (
    <div className="p-4 rounded-md bg-[#27272a] text-white shadow-md">
      <h3 className="text-lg font-semibold mb-4">{title[type]}</h3>

      <div className="mb-4 p-4 rounded bg-[#3b3b3e]">
        <label className="block text-sm font-medium mb-1">LLM Type</label>
        <Select
          value={llmType}
          onValueChange={value => {
            setLlmType(value)
            handleUpdateAgent()
          }}
        >
          <SelectTrigger className="w-full bg-[#1e1e23] text-white">
            <SelectValue placeholder="Select LLM Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ChatOpenAI">OpenAI</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex align-center justify-between items-center mb-4">
        <h4 className="text-md font-semibold mb-2">State Updates</h4>
        <ButtonDefault
          title="Add State Update"
          onClick={() => {
            handleAddStateUpdate()
            handleUpdateAgent()
          }}
          className="rounded-full flex items-center"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-5 w-5 mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
          }
        />
      </div>
      <div className="mt-4">
        {stateUpdates.map((update, index) => (
          <div key={index} className="mb-4 p-4 rounded bg-[#3b3b3e]">
            <div className="flex align-center justify-between items-center mb-4">
              <h4 className="text-md font-semibold mb-2">State Key</h4>
              <ButtonDefault
                title="Add State Key"
                onClick={() => {
                  handleAddStateKey(index)
                  handleUpdateAgent()
                }}
                className="rounded-full flex items-center mt-2"
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="h-5 w-5 mr-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                }
              />
            </div>
            <div className="flex items-center mb-2">
              <Input
                value={update.name}
                onChange={e =>
                  handleStateUpdateChange(index, 'name', e.target.value)
                }
                onBlur={handleUpdateAgent}
                className="w-full mr-2 bg-[#1e1e23] text-white"
                placeholder="State Update Name"
              />
              <Button
                className="text-white bg-[#e11d48] hover:bg-[#be123c] p-2 rounded"
                variant="outline"
                size="icon"
                onClick={() => {
                  handleDeleteStateUpdate(index)
                  handleUpdateAgent()
                }}
              >
                <XIcon className="h-4 w-4" color="white" />
              </Button>
            </div>
            {Object.entries(update._state).map(([key, value], stateIndex) => (
              <div key={stateIndex} className="flex items-center mb-2">
                <Input
                  value={key}
                  onChange={e => {
                    const newState = { ...update._state }
                    delete newState[key]
                    newState[e.target.value] = value
                    handleStateUpdateChange(index, '_state', newState)
                  }}
                  onBlur={handleUpdateAgent}
                  className="w-1/3 mr-2 bg-[#1e1e23] text-white"
                  placeholder="Key"
                />
                <Select
                  value={typeof value}
                  onValueChange={newType => {
                    let newValue: boolean | string | number = value
                    if (newType === 'boolean') newValue = Boolean(value)
                    else if (newType === 'number') newValue = Number(value)
                    else newValue = String(value)
                    handleStateKeyChange(index, key, newValue)
                    handleUpdateAgent()
                  }}
                >
                  <SelectTrigger className="w-1/3 mr-2 bg-[#1e1e23] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="boolean">Boolean</SelectItem>
                    <SelectItem value="string">String</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                  </SelectContent>
                </Select>
                {typeof value === 'boolean' ? (
                  <Select
                    value={String(value)}
                    onValueChange={newValue => {
                      handleStateKeyChange(index, key, newValue === 'true')
                      handleUpdateAgent()
                    }}
                  >
                    <SelectTrigger className="w-1/3 mr-2 bg-[#1e1e23] text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">True</SelectItem>
                      <SelectItem value="false">False</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    value={String(value)}
                    onChange={e => {
                      const newValue: boolean | string | number =
                        typeof value === 'number'
                          ? Number(e.target.value)
                          : e.target.value
                      handleStateKeyChange(index, key, newValue)
                    }}
                    onBlur={handleUpdateAgent}
                    className="w-1/3 mr-2 bg-[#1e1e23] text-white"
                    placeholder="Value"
                  />
                )}
                <Button
                  className="text-white bg-[#e11d48] hover:bg-[#be123c] p-2 rounded"
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    handleDeleteStateKey(index, key)
                    handleUpdateAgent()
                  }}
                >
                  <XIcon className="h-4 w-4" color="white" />
                </Button>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="absolute top-5 left-full flex flex-col items-center transform translate-x-3 space-y-4">
        <div className="flex items-center bg-gray-800 p-2 rounded-full shadow-lg hover:bg-gray-700 transition-colors">
          <Handle
            type="source"
            position={Position.Right}
            id={'prompt_' + chatAgentToPromptId}
            style={{
              background: '#f97316',
              borderRadius: '50%',
              height: '12px',
              width: '12px'
            }}
            isConnectable
            className="relative"
          />
          <span className="ml-2 mr-2 text-sm text-white font-semibold">
            Prompt
          </span>
        </div>
      </div>

      <div className="absolute top-16 mt-4 left-full flex flex-col items-center transform translate-x-3 space-y-4">
        {type === 'tools' && (
          <div className="flex items-center bg-gray-800 p-2 rounded-full shadow-lg hover:bg-gray-700 transition-colors">
            <Handle
              type="source"
              isConnectable
              position={Position.Right}
              id={'tool_' + toolsAgentToPromptId}
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

      <div className="absolute mr-6 top-5 right-full flex flex-col items-center transform translate-x-3 space-y-4">
        <div className="flex items-center bg-gray-800 p-2 rounded-full shadow-lg hover:bg-gray-700 transition-colors">
          <Handle
            type="source"
            position={Position.Left}
            id={'agentgraph_' + agentToGraphId}
            style={{
              background: '#008080',
              borderRadius: '50%',
              height: '12px',
              width: '12px'
            }}
            isConnectable
            className="relative"
          />
          <span className="ml-2 mr-2 text-sm text-white font-semibold">
            Graph
          </span>
        </div>
      </div>
    </div>
  )
}
