'use client'

import { CreateDataset } from './create'
import { DatasetCard } from '@/lib/dataset/card/DatasetCard'
import { DatasetSheet } from '@/lib/dataset/sheet'
import Link from 'next/link'
import { NAVIGATION } from '@/shared-utils/constant/navigation'
import { useGetListDatasetAtom } from '@/store/dataset/list'
import { useState } from 'react'
import { FileTypeValue } from '@/db'

export const Dataset = () => {
  const [open, setOpen] = useState(false)
  const [{ data, isLoading }] = useGetListDatasetAtom()

  return (
    <div className={'overflow-auto h-screen'}>
      <div className="flex flex-row justify-between">
        <h1 className="text-2xl">Your Datasets</h1>
        <CreateDataset />
      </div>

      <div className={'mt-8'}>
        {isLoading ? (
          <>Loading datasets...</>
        ) : (
          <>
            {data && data.status === 'fulfilled' ? (
              <div className={'grid grid-cols-4 gap-5'}>
                {data?.result?.data?.map((dataset) => {
                  const fileType = dataset.fileType
                  if (dataset?.gcpBucket?.length > 0) {
                    return (
                      <Link
                        key={dataset.id}
                        href={NAVIGATION.DATA_STORE.LIST.replace(
                          '{id}',
                          dataset.id
                        )}
                      >
                        <DatasetCard
                          open={null}
                          id={dataset.id}
                          setOpen={setOpen}
                          title={dataset.title}
                          dataType={dataset.dataType}
                          fileType={dataset.fileType}
                        />
                      </Link>
                    )
                  }
                  return (
                    <div key={dataset.id}>
                      <DatasetSheet
                        fileType={fileType ?? FileTypeValue.FINE_TUNE}
                        organizationId={dataset.organizationId ?? ''}
                        id={dataset.id}
                        open={open}
                        onOpenChange={setOpen}
                      >
                        <DatasetCard
                          id={dataset.id}
                          setOpen={setOpen}
                          open={open}
                          title={dataset.title}
                          dataType={dataset.dataType}
                          fileType={dataset.fileType}
                        />
                      </DatasetSheet>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p>Nothing yet...</p>
            )}
          </>
        )}
      </div>
    </div>
  )
}
