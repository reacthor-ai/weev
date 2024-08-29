import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'

interface MemoryConfig {
  type: 'mongodb' | 'postgresql'
  thread_id: string
  db_name: string
}

export function MemoryConfiguration() {
  const [memoryConfig, setMemoryConfig] = useState<MemoryConfig>({
    type: 'mongodb',
    thread_id: '',
    db_name: ''
  })

  const handleTypeChange = (value: 'mongodb' | 'postgresql') => {
    setMemoryConfig(prevConfig => ({ ...prevConfig, type: value }))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setMemoryConfig(prevConfig => ({ ...prevConfig, [name]: value }))
  }

  return (
    <div className="px-4 space-y-4">
      <div>
        <label
          htmlFor="memory-type"
          className="block text-sm font-medium text-white"
        >
          Memory Type
        </label>
        <Select value={memoryConfig.type} onValueChange={handleTypeChange}>
          <SelectTrigger className="w-full" id="memory-type">
            <SelectValue placeholder="Select memory type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mongodb">MongoDB</SelectItem>
            <SelectItem value="postgresql">PostgreSQL</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <label
          htmlFor="thread-id"
          className="block text-sm font-medium text-white"
        >
          Unique Id for memory
        </label>
        <Input
          id="thread-id"
          name="thread_id"
          value={memoryConfig.thread_id}
          onChange={handleInputChange}
          className="w-full"
        />
      </div>
      <div>
        <label
          htmlFor="db-name"
          className="block text-sm font-medium text-white"
        >
          Database Name
        </label>
        <Input
          id="db-name"
          name="db_name"
          value={memoryConfig.db_name}
          onChange={handleInputChange}
          className="w-full"
        />
      </div>
    </div>
  )
}
