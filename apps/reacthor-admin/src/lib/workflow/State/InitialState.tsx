import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Button, ButtonDefault } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { CheckIcon, PenIcon, PlusIcon, TrashIcon, XIcon } from 'lucide-react'
import { useState } from 'react'

type ItemType = 'boolean' | 'string' | 'number'

interface Item {
  id: number
  state: string
  value: number | string | boolean
  type: ItemType
}

export function InitialState() {
  const [items, setItems] = useState<Item[]>([
    { id: 1, state: 'Active', value: 100, type: 'number' },
    { id: 2, state: 'Inactive', value: '200', type: 'string' },
    { id: 3, state: 'Pending', value: true, type: 'boolean' },
    { id: 4, state: 'Active', value: 300, type: 'number' }
  ])
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editedState, setEditedState] = useState<string>('')
  const [editedValue, setEditedValue] = useState<string>('')

  const handleEdit = (id: number) => {
    const itemToEdit = items.find(item => item.id === id)
    if (itemToEdit) {
      setEditingId(id)
      setEditedState(itemToEdit.state)
      setEditedValue(String(itemToEdit.value))
    }
  }

  const handleSave = (id: number) => {
    setItems(
      items.map(item =>
        item.id === id
          ? {
              ...item,
              state: editedState,
              value: convertValue(editedValue, item.type)
            }
          : item
      )
    )
    setEditingId(null)
  }

  const handleCancel = () => {
    setEditingId(null)
  }

  const handleDelete = (id: number) => {
    setItems(items.filter(item => item.id !== id))
  }

  const handleTypeChange = (id: number, newType: ItemType) => {
    setItems(
      items.map(item =>
        item.id === id
          ? {
              ...item,
              type: newType,
              value: convertValue(String(item.value), newType)
            }
          : item
      )
    )
  }

  const convertValue = (
    value: string,
    type: ItemType
  ): number | string | boolean => {
    switch (type) {
      case 'number':
        return Number(value) || 0
      case 'boolean':
        return value === 'true'
      default:
        return value
    }
  }

  const handleAddItem = () => {
    const newId = Math.max(...items.map(item => item.id), 0) + 1
    const newItem: Item = {
      id: newId,
      state: 'New State',
      value: '',
      type: 'string'
    }
    setItems([...items, newItem])
  }

  return (
    <div className="container mx-auto">
      <ButtonDefault
        className="mr-4"
        defaultStyles
        onClick={handleAddItem}
        icon={<PlusIcon className="h-4 w-4 mr-2" />}
        title="Add State"
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>State</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="w-[100px]">Edit</TableHead>
            <TableHead className="w-[100px]">Delete</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map(item => (
            <TableRow key={item.id}>
              <TableCell>
                {editingId === item.id ? (
                  <Input
                    value={editedState}
                    onChange={e => setEditedState(e.target.value)}
                    className="w-full"
                  />
                ) : (
                  item.state
                )}
              </TableCell>
              <TableCell>
                {editingId === item.id ? (
                  item.type === 'boolean' ? (
                    <Select
                      value={editedValue}
                      onValueChange={value => setEditedValue(value)}
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Select value" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">True</SelectItem>
                        <SelectItem value="false">False</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      value={editedValue}
                      onChange={e => setEditedValue(e.target.value)}
                      className="w-full"
                    />
                  )
                ) : (
                  String(item.value)
                )}
              </TableCell>
              <TableCell>
                <Select
                  defaultValue={item.type}
                  onValueChange={(value: ItemType) =>
                    handleTypeChange(item.id, value)
                  }
                  disabled={editingId !== item.id}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="boolean">Boolean</SelectItem>
                    <SelectItem value="string">String</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                {editingId === item.id ? (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleSave(item.id)}
                    >
                      <CheckIcon className="h-4 w-4" />
                      <span className="sr-only">Save</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={handleCancel}>
                      <XIcon className="h-4 w-4" />
                      <span className="sr-only">Cancel</span>
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(item.id)}
                  >
                    <PenIcon className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                )}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(item.id)}
                >
                  <TrashIcon className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
