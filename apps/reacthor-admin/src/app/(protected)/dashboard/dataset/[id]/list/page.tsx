import { DatasetList } from '@/lib/dataset-list'
import { getDatasetById } from '@/db/dataset'
import { Suspense } from 'react'

export default async function DashboardDatasetList(props: any) {
  const { id } = props.params
  const dataStoreListId = await getDatasetById({ datastoreId: id })

  if (!dataStoreListId.success || !dataStoreListId.data) {
    return <>No data!</>
  }

  return (
    <Suspense fallback={'loading...'}>
      <DatasetList dataStoreList={dataStoreListId.data} />
    </Suspense>
  )
}
