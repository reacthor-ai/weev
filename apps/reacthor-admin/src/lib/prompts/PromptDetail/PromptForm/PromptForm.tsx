import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useState } from 'react'

type PromptFormProps = {
  addElement: any
  updateVariables: any
}

export const PromptForm = ({
  addElement,
  updateVariables
}: PromptFormProps) => {
  const [type, setType] = useState('message')
  const [role, setRole] = useState('system')
  const [text, setText] = useState('')
  const [placeholder, setPlaceholder] = useState('')
  const [varKey, setVarKey] = useState('')
  const [varValue, setVarValue] = useState('')
  const [isJsonEditorVisible, setIsJsonEditorVisible] = useState(false)
  const [jsonObject, setJsonObject] = useState({})

  const handleAddElement = (e: any) => {
    e.preventDefault()
    if (type === 'message') {
      addElement('message', { role, text })
    } else if (type === 'placeholder') {
      addElement('placeholder', placeholder)
    }
    setText('')
    setPlaceholder('')
  }

  const handleAddVariable = (e: any) => {
    e.preventDefault()
    if (isJsonEditorVisible) {
      updateVariables(varKey, jsonObject)
    } else {
      try {
        const parsedValue = JSON.parse(varValue)
        updateVariables(varKey, parsedValue)
      } catch (error) {
        updateVariables(varKey, varValue)
      }
    }
    setVarKey('')
    setVarValue('')
    setJsonObject({})
  }

  return (
    <form className="grid w-full items-start gap-6">
      <fieldset className="grid gap-6 rounded-lg border p-4">
        <legend className="-ml-1 px-1 text-sm font-medium">Messages</legend>
        <div className="grid gap-3">
          <Label htmlFor="type">Type</Label>
          <Select value={type} onValueChange={e => setType(e)}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="message">Message</SelectItem>
              <SelectItem value="placeholder">Placeholder</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {type === 'message' && (
          <>
            <div className="grid gap-3">
              <Label htmlFor="role">Role</Label>
              <Select value={role} onValueChange={e => setRole(e)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="system">System</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="assistant">Assistant</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="You are a..."
                className="min-h-[9.5rem]"
              />
            </div>
          </>
        )}
        {type === 'placeholder' && (
          <div className="grid gap-3">
            <Label htmlFor="placeholder">Placeholder</Label>
            <Input
              id="placeholder"
              value={placeholder}
              onChange={e => setPlaceholder(e.target.value)}
              placeholder="Placeholder name"
            />
          </div>
        )}
        <button
          type="submit"
          onClick={handleAddElement}
          className="btn btn-primary mt-4"
        >
          Add Element
        </button>
      </fieldset>
      <fieldset className="grid gap-6 rounded-lg border p-4">
        <legend className="-ml-1 px-1 text-sm font-medium">Variables</legend>
        <div className="grid gap-3">
          <Label htmlFor="varKey">Variable Key</Label>
          <Input
            id="varKey"
            value={varKey}
            onChange={e => setVarKey(e.target.value)}
            placeholder="Variable Key"
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="varValue">Variable Value</Label>
          <Textarea
            id="varValue"
            value={varValue}
            onChange={e => setVarValue(e.target.value)}
            placeholder="Variable Value (can be JSON)"
          />
        </div>
        <button
          type="submit"
          onClick={handleAddVariable}
          className="btn btn-primary mt-4"
        >
          Add Variable
        </button>
      </fieldset>
    </form>
  )
}
