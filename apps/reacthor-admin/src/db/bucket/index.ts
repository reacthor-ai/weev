import { ReturnApi } from '@/db/types'
import { reacthorDbClient, MessagingRoleValue } from '@/db'

export type PickTransactionMessaging = Pick<
  CreateBucketStoreTransactionMessagingParams,
  'bucketStoreData' | 'masterBucketId' | 'datastoreId'
> & {
  organizationId: string
}

export type CreateBucketStoreTransactionMessagingParams = {
  bucketStoreData: Array<{
    datastoreId: string
    bucketId: string
  }>
  messagingStoreData: Array<{
    role: MessagingRoleValue
    content: string
    datastoreId: string
  }>
  datastoreId: string
  masterBucketId: string
}

export const createBucketStoreTransactionMessaging = async (params: CreateBucketStoreTransactionMessagingParams) => {
    const { bucketStoreData, messagingStoreData, masterBucketId, datastoreId } = params;

    try {
      const updateMasterBucketId = reacthorDbClient.datastore.update({
        where: { id: datastoreId },
        data: {
          masterBucketId
        }
      })

      const createManyBucketStores = reacthorDbClient.gcpBucketStore.createMany({
        data: bucketStoreData
      });

      const createManyMessagingTable = reacthorDbClient.messaging.createMany({
        data: messagingStoreData,
      })

      const [, bucketStore, messagingTable] = await reacthorDbClient.$transaction(
        [
          updateMasterBucketId,
          createManyBucketStores,
          createManyMessagingTable
        ]
      )

      if (bucketStore.count > 1 && messagingTable.count > 1) {
        return {
          success: true,
          data: null,
          error: null
        }
      }

    } catch (error) {
      return {
        success: false,
        data: null,
        error
      }
    }
}

export type CreateGCPBucketStoreRagParams = Pick<CreateBucketStoreTransactionMessagingParams, 'bucketStoreData'>

export const createGCPBucketStoreRag = async (params: CreateGCPBucketStoreRagParams) => {
    const { bucketStoreData } = params;

    try {
      const createManyBucketStores = await reacthorDbClient.gcpBucketStore.createMany({
        data: bucketStoreData
      });

      if (createManyBucketStores.count >= 1) {
        return Response.json({
          success: true,
          data: 'success',
          error: null
        })
      } else {
        return Response.json({
          success: true,
          data: null,
          error: 'Error when updating count'
        })
      }

    } catch (error) {
      return Response.json({
        success: false,
        data: null,
        error
      })
    }
}