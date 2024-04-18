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
import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useGetListDatasetAtom } from '@/store/dataset/list'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { useUploadFineTuneJobAtom } from '@/store/messaging/upload-fine-tune-job'
import { v4 as uuidv4 } from 'uuid'
import { Input } from '@/components/ui/input'

export const CreateFinetuningJob = () => {
  const [title, setTitle] = useState<string>('')
  const [assistantChat, setAssistantChat] = useState<string>('')
  const [dataStoreId, setDatasource] = useState<string>('')
  const [successMessage, setSuccessMessage] = useState<boolean>(false)

  const [{ data, isLoading }] = useGetListDatasetAtom()
  const [{ mutate: uploadFineTuneJob, isPending }] = useUploadFineTuneJobAtom()

  const organizationId = data?.result?.data![0]?.organizationId

  const handleSetValue = async () => {
    if (!data?.result.data?.length) {
      console.log('nope')
      return null
    }

    await uploadFineTuneJob(
      {
        organizationId: organizationId ?? '',
        dataStoreId,
        finetuneBucketId: uuidv4(),
        assistantChat,
        title
      },
      {
        onSettled: data => {
          if (data && data.result?.data?.id) {
            setSuccessMessage(true)
            setTimeout(() => {
              window.location.reload()
            }, 1000)
          }
        }
      }
    )
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="bg-white text-black hover:bg-black hover:text-white"
        >
          New Fine tune
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[100%] flex flex-col justify-start items-start">
        <DialogHeader>
          <DialogTitle>Create your fine tune job</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="w-[100%] grid grid-cols-1 items-center gap-4">
            <Input
              id="title"
              placeholder={'Name your Dataset'}
              onChange={e => setTitle(e.target.value)}
            />
            <Input
              id="assistantChat"
              placeholder={'What should your assistant chat be?'}
              onChange={e => setAssistantChat(e.target.value)}
            />
          </div>
          <Select onValueChange={setDatasource}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Pick your data files" />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                {isLoading ? (
                  <>Loading...</>
                ) : (
                  data?.result?.data
                    ?.filter(d => d.fileType === 'FINE_TUNE')
                    .map(value => (
                      <SelectItem key={value.id} value={value.id}>
                        {value.title}
                      </SelectItem>
                    ))
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          {
            successMessage ? "Success Please close out now!" : (
              <Button
                disabled={isPending}
                onClick={handleSetValue}
                className="bg-white text-black hover:bg-black hover:text-white"
              >
                {isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Create
              </Button>
            )
          }
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
