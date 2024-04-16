'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckIcon, DatabaseIcon } from 'lucide-react'
import { ReacthorDatastoreType } from '@/db'
import { useRouter } from 'next/navigation'
import { NAVIGATION } from '@/shared-utils/constant/navigation'
import { useEffect } from 'react'

type DatasetCardProps = Pick<ReacthorDatastoreType, 'title' | 'fileType' | 'dataType'> & {
  setOpen?: any
  id: string
  open: boolean | null
}

export function DatasetCard(props: DatasetCardProps) {
  const { title, fileType, dataType, setOpen, id, open } = props
  const router = useRouter()

  const openClick = () => {
    if (open === null) return
    setOpen((a: any) => !a)
    return router.push(`${NAVIGATION.DATA_STORE.HOME}?id=${id}`)
  }

  useEffect(() => {
    if (open === null) return
    if (!open) {
      router.push(NAVIGATION.DATA_STORE.HOME)
    }
  }, [open])

  return (
    <div onClick={openClick} className="flex flex-col items-start gap-4 bg-[#00000] text-white justify-center">
      <Card className="rounded-lg border-[#27272a] cursor-pointer bg-black text-white border p-4">
        <CardHeader className="flex items-center gap-4">
          <DatabaseIcon className="w-8 h-8 text-white" />
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2 mt-2">
          <Badge className="items-center text-white" variant="outline">
            <CheckIcon className="h-3.5 w-3.5 -translate-x-1" />
            <p className="text-white">{fileType ?? 'Not configured'}</p>
          </Badge>
          <Badge className="items-center text-white" variant="outline">
            <CheckIcon className="h-3.5 w-3.5 -translate-x-1" />
            <p className="text-white">{dataType ?? 'Not configured'}</p>
          </Badge>
        </CardContent>
      </Card>
    </div>
  )
}
