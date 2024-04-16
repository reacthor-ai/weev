'use client'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'
import { UploadBox } from '@/lib/dataset/upload-box/UploadBox'
import { ReactNode, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import { REACTHOR_API_ROUTES } from '@/shared-utils/constant/navigation'
import { SignedPostPolicyV4Output } from '@google-cloud/storage'
import { STORAGE_PREFIX } from '@/shared-utils/constant/prefix'
import { CreateGCPBucketStoreRagParams, PickTransactionMessaging } from '@/db/bucket'
import { FileTypeValue } from '@/db'

type DatasetSheetProps = {
  onOpenChange: (v: boolean) => void
  open: boolean
  children: ReactNode
  id: string
  organizationId: string
  fileType: FileTypeValue
}

export function DatasetSheet(props: DatasetSheetProps) {
  const {
    open,
    onOpenChange,
    children,
    organizationId,
    id: datastoreId,
    fileType
  } = props
  const [files, setFiles] = useState<File[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const transformAndSaveFineTune = async (params: PickTransactionMessaging) => {
    try {
      const response = await fetch(REACTHOR_API_ROUTES.GCP.FUNCTION.TRIGGER, {
        method: 'POST',
        body: JSON.stringify(params)
      })
      setLoading(false)
      onOpenChange(false)
      return await response.json()
    } catch (error) {
      console.log(`Error when triggering function`, error)
    }
  }

  const saveRagDoc = async (params: CreateGCPBucketStoreRagParams) => {
    try {
      const response = await fetch(REACTHOR_API_ROUTES.CREATE_GCP_STORE_RAG, {
        method: 'POST',
        body: JSON.stringify(params)
      })
      setLoading(false)
      onOpenChange(false)
      return await response.json()
    } catch (error) {
      console.log(`Error when triggering function`, error)
    }
  }

  const handleUploadManyFiles = async () => {
    setLoading(true)
    const folderId = uuidv4()
    // Array to hold file paths that will be sent to the server
    const filePaths = files.map(() => {
      const id = uuidv4()

      const fineTunePath =
        fileType === 'FINE_TUNE'
          ? STORAGE_PREFIX.organization.line.fine_tune.sparse(folderId, id)
          : STORAGE_PREFIX.organization.line.rag.sparse(folderId, id)

      return {
        fullPath: `${STORAGE_PREFIX.organization.home(
          organizationId
        )}/${fineTunePath}`,
        pathIds: {
          folderPathId: folderId,
          bucketId: id
        }
      }
    })

    try {
      // Post these file paths to get signed URLs and other necessary data for upload
      const response = await fetch(
        REACTHOR_API_ROUTES.GCP.STORAGE.UPLOAD_FILE,
        {
          method: 'POST',
          body: JSON.stringify({ files: filePaths })
        }
      )

      if (!response.ok) throw new Error('Failed to get signed URLs')

      const { result } = await response.json()

      // Upload files to the signed URLs
      const uploadPromises = result.map(
        async (uploadData: SignedPostPolicyV4Output, index: number) => {
          const formData = new FormData()

          // Append all fields received from the server necessary for the upload
          Object.entries(uploadData.fields).forEach(([key, value]) => {
            formData.append(key, value)
          })

          // Append the corresponding file from the state
          formData.append('file', files[index]) // Make sure 'file' is the correct key as expected by your server

          // Perform the upload
          const uploadResponse = await fetch(uploadData.url, {
            method: 'POST',
            body: formData
          })

          // Handle 204 No Content response
          if (uploadResponse.status === 204) {
            return { success: true }
          }

          return { success: true }
        }
      )

      // Wait for all uploads to complete
      await Promise.all(uploadPromises)
    } catch (error) {
      console.error('Error during file upload:', error)
    } finally {
      const bucketStoreData = filePaths.map(v => ({
        datastoreId,
        bucketId: v.pathIds.bucketId
      }))

      if (fileType === 'FINE_TUNE') {
        await transformAndSaveFineTune({
          bucketStoreData,
          masterBucketId: folderId,
          datastoreId,
          organizationId
        })
      } else if (fileType === 'RAG') {
        await saveRagDoc({ bucketStoreData })
      }
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        className={
          'text-white border border-[#27272a] flex flex-col items-start justify-start w-screen bg-black overflow-auto h-screen'
        }
      >
        <SheetHeader>
          <SheetTitle className={'text-white'}>Upload</SheetTitle>
          <SheetDescription className={'mb-6'}>
            Type of data: either for fine-tuning (conversations) or rag (general
            document).
          </SheetDescription>
          <Button
            disabled={loading || files.length <= 0}
            onClick={handleUploadManyFiles}
            className="bg-white text-black hover:bg-black hover:text-white"
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Upload Files
          </Button>
        </SheetHeader>
        <div className="grid gap-4 py-2 w-[100%]">
          <UploadBox files={files} setFiles={setFiles} />
        </div>
        <SheetFooter></SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
