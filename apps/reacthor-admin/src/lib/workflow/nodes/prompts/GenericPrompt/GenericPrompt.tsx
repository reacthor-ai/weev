import React from 'react'
import TextareaAutosize from 'react-textarea-autosize'
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
import {
  usePromptAddChatInput,
  usePromptAddMessage,
  usePromptDeleteChatInput,
  usePromptDeleteMessage,
  usePromptFormStates,
  usePromptUpdateChatInput,
  usePromptUpdateMessage
} from '@/store/workflow/prompt/prompt'
import { useNodeId } from '@/hooks/useNodeId'

export const GenericPromptNode: React.FC<EdgeProps> = ({ id }) => {
  const promptToChatAgentId = useNodeId(id)
  const promptFormStates = usePromptFormStates()

  // Extract the most recently added prompt to use in the UI
  const { messages, chat_inputs } = promptFormStates[
    promptFormStates.length - 1
  ] || { messages: [], chat_inputs: {} }

  const addMessage = usePromptAddMessage()
  const updateMessage = usePromptUpdateMessage()
  const deleteMessage = usePromptDeleteMessage()
  const updateChatInput = usePromptUpdateChatInput()
  const deleteChatInput = usePromptDeleteChatInput()
  const addChatInput = usePromptAddChatInput(promptFormStates.length - 1)

  const handleAddRole = () => {
    addMessage(promptFormStates.length - 1)
  }

  const handleRoleChange = (
    index: number,
    newRole: 'system' | 'ai' | 'user'
  ) => {
    updateMessage({
      index: promptFormStates.length - 1,
      messageIndex: index,
      field: 'role',
      value: newRole
    })
  }

  const handleContentChange = (index: number, newContent: string) => {
    updateMessage({
      index: promptFormStates.length - 1,
      messageIndex: index,
      field: 'content',
      value: newContent
    })
  }

  const handleDeleteRole = (index: number) => {
    deleteMessage({ index: promptFormStates.length - 1, messageIndex: index })
  }

  const handleAddChatInput = () => {
    addChatInput()
  }

  const handleChatInputChange = (
    prevKey: string,
    newKey: string,
    value: string
  ) => {
    const updatedChatInputs = { ...chat_inputs }
    if (newKey !== prevKey) {
      delete updatedChatInputs[prevKey]
    }
    updatedChatInputs[newKey] = value

    // Update the chat input state
    updateChatInput({ index: promptFormStates.length - 1, key: newKey, value })
  }

  const handleDeleteChatInput = (key: string) => {
    deleteChatInput({ index: promptFormStates.length - 1, key })
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

      <div className="absolute mr-4 top-5 right-full flex flex-col items-center transform translate-x-3 space-y-4">
        <div className="flex items-center bg-gray-800 p-2 rounded-full shadow-lg hover:bg-gray-700 transition-colors">
          <Handle
            type="target"
            id={'prompt_' + promptToChatAgentId}
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
          {Object.entries(chat_inputs).map(([key, value]) => (
            <div key={key} className="flex gap-4 items-center mb-4">
              <label className="block text-sm font-medium flex-1">
                <Input
                  type="text"
                  value={key}
                  onChange={e =>
                    handleChatInputChange(key, e.target.value, value)
                  }
                  className="ml-2 p-2 rounded bg-[#1e1e23] text-white w-full"
                  placeholder="Input"
                />
              </label>
              <label className="block text-sm font-medium flex-1">
                <Input
                  type="text"
                  value={value}
                  onChange={e =>
                    handleChatInputChange(key, key, e.target.value)
                  }
                  className="ml-2 p-2 rounded bg-[#1e1e23] text-white w-full"
                  placeholder="Value"
                />
              </label>
              <Button
                className="text-red-500 bg-[#e11d48] hover:text-red-700"
                variant="outline"
                size="icon"
                onClick={() => handleDeleteChatInput(key)}
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
