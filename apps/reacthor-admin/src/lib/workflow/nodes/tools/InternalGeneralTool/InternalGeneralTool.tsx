import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { EdgeProps, Handle, Position } from '@xyflow/react'
import { useNodeId } from '@/hooks/useNodeId'

interface Arg {
  key: string
  value: string
}

interface Func {
  type: string
  args: { [key: string]: string }
  _return: string | object
}

export const InternalGeneralTool: React.FC<EdgeProps> = ({ id }) => {
  const [name, setName] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [func, setFunc] = useState<Func>({
    type: 'internal_general_tool',
    args: {},
    _return: ''
  })
  const [args, setArgs] = useState<Arg[]>([])
  const internalGeneralToolToAgentId = useNodeId(id)

  const handleNameChange = (newName: string) => {
    const sanitizedName = newName.toLowerCase().replace(/[^a-z_]/g, '')
    setName(sanitizedName)
  }

  const handleDescriptionChange = (newDescription: string) => {
    setDescription(newDescription)
  }

  const handleAddArg = () => {
    setArgs([...args, { key: '', value: '' }])
  }

  const handleArgChange = (
    index: number,
    field: 'key' | 'value',
    value: string
  ) => {
    const updatedArgs = args.map((arg, i) =>
      i === index
        ? {
            ...arg,
            [field]:
              field === 'key'
                ? value.toLowerCase().replace(/[^a-z_]/g, '')
                : value
          }
        : arg
    )
    setArgs(updatedArgs)
  }

  const handleReturnChange = (value: string) => {
    setFunc(prevFunc => ({ ...prevFunc, _return: value }))
  }

  useEffect(() => {
    const updatedArgs = args.reduce(
      (acc, { key, value }) => {
        if (key) acc[key] = value
        return acc
      },
      {} as { [key: string]: string }
    )

    setFunc(prevFunc => ({ ...prevFunc, args: updatedArgs }))
  }, [args])

  return (
    <div className="bg-[#27272a] text-white p-4 rounded-md shadow-md">
      <h3 className="text-lg font-semibold mb-2">Internal General Tool</h3>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Tool Name</label>
        <Input
          value={name}
          onChange={e => handleNameChange(e.target.value)}
          className="w-full"
          placeholder="Enter tool name"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Description</label>
        <Textarea
          value={description}
          onChange={e => handleDescriptionChange(e.target.value)}
          className="w-full"
          placeholder="Enter tool description"
        />
      </div>

      <div className="mb-4">
        <h4 className="text-md font-semibold mb-2">Arguments</h4>
        {args.map((arg, index) => (
          <div key={index} className="flex items-center mb-2">
            <Input
              value={arg.key}
              onChange={e => handleArgChange(index, 'key', e.target.value)}
              className="w-1/2 mr-2"
              placeholder="Key"
            />
            <Input
              value={arg.value}
              onChange={e => handleArgChange(index, 'value', e.target.value)}
              className="w-1/2"
              placeholder="Value"
            />
          </div>
        ))}
        <Button onClick={handleAddArg}>Add Argument</Button>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Return</label>
        <Input
          value={
            typeof func._return === 'string'
              ? func._return
              : JSON.stringify(func._return)
          }
          onChange={e => handleReturnChange(e.target.value)}
          className="w-full"
          placeholder="Enter return value or JSON object"
        />
      </div>

      <div className="absolute mr-4 top-5 right-full flex flex-col items-center transform translate-x-3 space-y-4">
        <div className="flex items-center bg-gray-800 p-2 rounded-full shadow-lg hover:bg-gray-700 transition-colors">
          <Handle
            type="target"
            id={'tool_' + internalGeneralToolToAgentId}
            position={Position.Left}
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
    </div>
  )
}
