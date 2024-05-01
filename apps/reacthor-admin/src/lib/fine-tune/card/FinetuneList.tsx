'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckIcon, StarIcon } from 'lucide-react'
import { ReturnFinetuneList } from '@/clients/openai/fineTuneList'

type FinetuneListProps = ReturnFinetuneList

export function FinetuneList(props: FinetuneListProps) {
  const { title, jobDetails: { status, created_at } } = props
  return (
    <div
      onClick={() => null}
      className="flex flex-col items-start gap-4 bg-[#00000] text-white justify-center"
    >
      <Card className="rounded-lg border-[#27272a] cursor-pointer bg-black text-white border p-4">
        <CardHeader className="flex items-center gap-4">
          <StarIcon className="w-8 h-8 text-white" />
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2 mt-2">
          <Badge className="items-center text-white" variant="outline">
            <CheckIcon className="h-3.5 w-3.5 -translate-x-1" />
            <p className="text-white">Status {status}</p>
          </Badge>
          <Badge className="items-center text-white" variant="outline">
            <CheckIcon className="h-3.5 w-3.5 -translate-x-1" />
            <p className="text-white">Created at: {new Date(created_at).toString()}</p>
          </Badge>
        </CardContent>
      </Card>
    </div>
  )
}
