'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Button, ButtonDefault } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { DataTypeValue, FileTypeValue, FileType, DataType } from '@/db'
import { useState } from 'react'
import { useCreateDatasetAtom } from '@/store/dataset/create'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

type CreateDatasetProps = {}

export const CreateDataset = (_: CreateDatasetProps) => {
  const [fileValue, setFileValue] = useState<string>('')
  const [dataValue, setDataValue] = useState<string>('')
  const [title, setTitle] = useState<string>('')

  const router = useRouter()
  const [{ mutate: createDatasetAtom, isPending }] = useCreateDatasetAtom()

  const fileType = Object.keys(FileTypeValue)
  const dataType = Object.keys(DataTypeValue)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <ButtonDefault title={'New Dataset'} />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] flex flex-col justify-start items-start">
        <DialogHeader>
          <DialogTitle>Create your dataset</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Input
              id="title"
              placeholder={'Name your Dataset'}
              className="col-span-8"
              onChange={e => setTitle(e.target.value)}
            />
          </div>
          <div>
            <Select onValueChange={setFileValue}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="File type" />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  {fileType.map(value => (
                    <SelectItem key={value} value={value}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select onValueChange={setDataValue}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Data set type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {dataType.map(value => (
                    <SelectItem key={value} value={value}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button
            disabled={isPending}
            onClick={() =>
              createDatasetAtom(
                {
                  title,
                  fileType: fileValue as FileType,
                  dataType: dataValue as DataType
                },
                {
                  onSettled: () => {
                    router.refresh()
                  }
                }
              )
            }
            className="bg-white text-black hover:bg-black hover:text-white"
          >
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
