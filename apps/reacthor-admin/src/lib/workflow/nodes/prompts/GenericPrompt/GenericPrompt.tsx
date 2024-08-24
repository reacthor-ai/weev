import React, { useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import { Button, ButtonDefault } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Handle, Position } from '@xyflow/react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { XIcon } from 'lucide-react'

interface Message {
  role: 'system' | 'ai' | 'user'
  content: string
}

interface ChatInput {
  key: string
  value: string
}

export const GenericPromptNode: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'system',
      content:
        'You are {agent_name}, a customer support specialist for {company_name}. Your primary goal is to assist users in resolving their inquiries or issues related to {company_name}.'
    }
  ])

  const [chatInputs, setChatInputs] = useState<ChatInput[]>([
    { key: 'agent_name', value: 'Nook' },
    { key: 'company_name', value: 'Reacthor' }
  ])

  const handleAddRole = () => {
    setMessages([
      ...messages,
      {
        role: 'system', // default role
        content: ''
      }
    ])
  }

  const handleRoleChange = (
    index: number,
    newRole: 'system' | 'ai' | 'user'
  ) => {
    const updatedMessages = messages.map((message, i) =>
      i === index ? { ...message, role: newRole } : message
    )
    setMessages(updatedMessages)
  }

  const handleContentChange = (index: number, newContent: string) => {
    const updatedMessages = messages.map((message, i) =>
      i === index ? { ...message, content: newContent } : message
    )
    setMessages(updatedMessages)
  }

  const handleDeleteRole = (index: number) => {
    const updatedMessages = messages.filter((_, i) => i !== index)
    setMessages(updatedMessages)
  }

  const handleAddChatInput = () => {
    setChatInputs([...chatInputs, { key: '', value: '' }])
  }

  const handleChatInputChange = (index: number, key: string, value: string) => {
    const updatedInputs = chatInputs.map((input, i) =>
      i === index ? { key, value } : input
    )
    setChatInputs(updatedInputs)
  }

  const handleDeleteChatInput = (index: number) => {
    const updatedInputs = chatInputs.filter((_, i) => i !== index)
    setChatInputs(updatedInputs)
  }

  return (
    <div className="border border-gray-700 hover:shadow-lg w-full rounded-lg p-6 bg-[#27272a] text-white">
      {/* Header for roles */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-lg font-semibold">General Prompt Template</div>
        <ButtonDefault
          title="Add Prompt"
          onClick={handleAddRole}
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

      {messages.map((message, index) => (
        <div key={index} className="bg-[#3b3b3e] p-4 rounded-lg mb-6">
          <div className="flex gap-4 items-center mb-4">
            <Select
              value={message.role}
              onValueChange={value =>
                handleRoleChange(index, value as 'system' | 'ai' | 'user')
              }
            >
              <SelectTrigger className="mt-2 bg-[#1e1e23]">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="system">System</SelectItem>
                <SelectItem value="ai">AI</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              <TextareaAutosize
                value={message.content}
                onChange={e => handleContentChange(index, e.target.value)}
                className="w-full p-3 mt-2 bg-[#1e1e23] text-white rounded-lg resize-none"
                placeholder="Enter content here..."
                minRows={2}
              />
            </label>
          </div>
          <ButtonDefault
            title="Remove"
            onClick={() => handleDeleteRole(index)}
            className="bg-[#e11d48] text-white hover:bg-white hover:text-black"
            icon={null}
          />
        </div>
      ))}

      <div className="absolute top-5 left-full flex items-center transform translate-x-3">
        <div className="flex items-center bg-gray-800 p-2 rounded-full shadow-lg hover:bg-gray-700 transition-colors">
          <Handle
            type="source"
            position={Position.Right}
            id="agentConnector"
            style={{
              background: '#f97316', // A vibrant color to stand out
              borderRadius: '50%',
              height: '12px',
              width: '12px'
            }}
            className="relative"
          />
          <span className="ml-2 mr-2 text-sm text-white font-semibold">
            Agent
          </span>
        </div>
      </div>

      {/* Section for chat inputs */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-6">
          <div className="text-lg font-semibold">Chat Input</div>
          <ButtonDefault
            title="Add Input"
            onClick={handleAddChatInput}
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
        <div className="bg-[#3b3b3e] p-4 rounded-lg mb-6">
          {chatInputs.map((input, index) => (
            <div key={index} className="flex gap-4 items-center mb-4">
              <label className="block text-sm font-medium flex-1">
                <Input
                  type="text"
                  value={input.key}
                  onChange={e =>
                    handleChatInputChange(index, e.target.value, input.value)
                  }
                  className="ml-2 p-2 rounded bg-[#1e1e23] text-white w-full"
                  placeholder="Input"
                />
              </label>
              <label className="block text-sm font-medium flex-1">
                <Input
                  type="text"
                  value={input.value}
                  onChange={e =>
                    handleChatInputChange(index, input.key, e.target.value)
                  }
                  className="ml-2 p-2 rounded bg-[#1e1e23] text-white w-full"
                  placeholder="Value"
                />
              </label>
              <Button
                className="text-red-500 bg-[#e11d48] hover:text-red-700"
                variant="outline"
                size="icon"
                onClick={() => handleDeleteChatInput(index)}
              >
                <XIcon className="h-4 w-4" color="white" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
