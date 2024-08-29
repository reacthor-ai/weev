import React, { useState } from 'react'
import { EdgeProps, Handle, Position } from '@xyflow/react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Button, ButtonDefault } from '@/components/ui/button'
import { TrashIcon } from 'lucide-react'
import { useNodeId } from '@/hooks/useNodeId'

interface Condition {
  key: string
  value: boolean
}

interface ConditionalRouterProps {
  data: {
    label: string
    conditions: Condition[]
  }
}

export function ConditionalRouter({
  data,
  id
}: EdgeProps & ConditionalRouterProps) {
  const conditionToGraphId = useNodeId(id)

  const [conditions, setConditions] = useState<Condition[]>(
    data.conditions || []
  )

  const mockStateItems = ['greet', 'farewell', 'ask_question', 'provide_info']

  const addCondition = () => {
    setConditions([...conditions, { key: '', value: false }])
  }

  const removeCondition = (index: number) => {
    const newConditions = conditions.filter((_, i) => i !== index)
    setConditions(newConditions)
  }

  const updateCondition = (index: number, key: string, value: boolean) => {
    const newConditions = [...conditions]
    newConditions[index] = { key, value }
    setConditions(newConditions)
  }

  return (
    <div className="bg-[#27272a] text-white rounded-md p-3">
      <div className="flex align-center justify-between items-center mb-4">
        <h4 className="text-md font-semibold mb-2">Conditional Router</h4>
        <ButtonDefault
          title="Add condition"
          onClick={addCondition}
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

      <div className="bg-[#3b3b3e] mb-4 p-4 rounded">
        <label className="block text-sm font-medium mb-3">State</label>
        {conditions.map((condition, index) => (
          <div key={index} className="flex items-center space-x-2 mb-2">
            <Select
              value={condition.key}
              onValueChange={value =>
                updateCondition(index, value, condition.value)
              }
            >
              <SelectTrigger className="w-[180px] bg-[#1e1e23] text-white">
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {mockStateItems.map(item => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={condition.value.toString()}
              onValueChange={value =>
                updateCondition(index, condition.key, value === 'true')
              }
            >
              <SelectTrigger className="w-[100px] bg-[#1e1e23] text-white">
                <SelectValue placeholder="Value" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">True</SelectItem>
                <SelectItem value="false">False</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeCondition(index)}
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      <div className="absolute mt-14 mr-6 top-5 right-full flex flex-col items-center transform translate-x-3 space-y-4">
        <div className="flex items-center bg-gray-800 p-2 rounded-full shadow-lg hover:bg-gray-700 transition-colors">
          <Handle
            type="source"
            id={'condition_' + conditionToGraphId}
            position={Position.Left}
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
            Graph
          </span>
        </div>
      </div>
    </div>
  )
}
