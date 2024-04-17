'use client'

import { DatasetTable } from './table'
import { columns } from './table/Columns/Columns'
import { ReturnGetdatasetByIdType } from '@/db/dataset'

type DatasetListProps = {
  dataStoreList: ReturnGetdatasetByIdType
}

const Title = ({
  title,
  description
}: {
  title: string
  description: string
}) => {
  return (
    <div className="mb-6">
      <h2 className="text-2xl mb-2">{title}</h2>
      <p className="text-gray-500">{description}</p>
    </div>
  )
}

export const DatasetList = (props: DatasetListProps) => {
  const { dataStoreList } = props
  const datasetType = dataStoreList.fileType
  const messaging = dataStoreList.messaging
  return (
    <div className={'overflow-auto h-screen mt-6 ml-6'}>
      {datasetType === 'RAG' && (
        <>
          <Title
            title="Alycia data set"
            description="Edit your RAG docs, to make sure the model follows a set of guidelines."
          />
          {dataStoreList.gcpBucket.map((_: unknown, key: number) => {
            return <>{key + 1} document available</>
          })}
        </>
      )}
      {datasetType === 'FINE_TUNE' && (
        <>
          <Title
            title="Alycia data set"
            description="Annotate your data, to guide your model."
          />

          <DatasetTable data={messaging as any} columns={columns} />
        </>
      )}
      <div style={{ marginBottom: '3rem' }} />
    </div>
  )
}
