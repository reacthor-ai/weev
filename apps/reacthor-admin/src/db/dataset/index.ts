import { ReturnApi } from '@/db/types'
import { ReacthorDatastoreType, reacthorDbClient } from '@/db'
import { getUser } from '@/db/user'
import { FileType, DataType, ReacthorMessagingType, ReacthorGcpBucketStoreType } from '@/db'

export type CreateDatasetParams = {
  title: string
  fileType: FileType
  dataType: DataType
}

export const createDataset = async (params: CreateDatasetParams) => {
    const { title, fileType, dataType } = params;

    try {
      const user = await getUser()

      if (user && user.organizationId) {
        const result = await reacthorDbClient.organization.update({
          where: {
            id: user.organizationId,
          },

          data: {
            storage: {
              create: {
                title,
                fileType,
                dataType
              }
            }
          }
        });

        return Response.json({
          success: true,
          data: result,
          error: null
        } as ReturnApi<any>)
      }

      return Response.json({
        success: false,
        data: null,
        error: 'NO USER'
      } as ReturnApi<any>)
    } catch (error) {
      return Response.json({
        success: true,
        data: null,
        error
      } as ReturnApi<any>)
    }
}

export type ReturnGetListDataset = ReacthorDatastoreType & {
  gcpBucket: ReacthorGcpBucketStoreType[]
}

export const listDataset = async () => {
    try {
      const user = await getUser()

      if (user && user.organizationId) {
        const result = await reacthorDbClient.datastore.findMany({
          where: {
            organizationId: user.organizationId
          },
          include: {
            gcpBucket: true,
          }
        });

        return Response.json({
          success: true,
          data: result,
          error: null
        })
      }

      return Response.json({
        success: false,
        data: null,
        error: 'NO USER'
      })
    } catch (error) {
      return Response.json({
        success: true,
        data: null,
        error
      } as ReturnApi<any>)
    }
}

type GetDatasetByIdParams = {
  datastoreId: string | null
}



export type ReturnGetdatasetByIdType = ReacthorDatastoreType & {
  messaging: ReacthorMessagingType[]
  gcpBucket: ReacthorGcpBucketStoreType[]
}

export const getDatasetById = async (params: GetDatasetByIdParams): Promise<ReturnApi<ReturnGetdatasetByIdType | null>> => {
    const { datastoreId } = params;

    if (!datastoreId) {
      return {
        success: false,
        data: null,
        error: 'No [datastoreId] provided'
      }
    }

    try {
      const result = await reacthorDbClient.datastore.findUnique({
        where: {
          id: datastoreId,
        },
        include: {
          messaging: true,
          gcpBucket: true
        }
      });

      if (result && result.id) {
        return {
          success: true,
          data: result,
          error: null
        }
      }
      return {
        success: true,
        data: null,
        error: 'Not found the result by id'
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        error
      }
    }
}