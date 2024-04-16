import {
  PrismaClient,
  User as ReacthorUser,
  Organization as ReacthorOrganizationType,
  type FileType,
  type DataType,
  FileType as FileTypeValue,
  DataType as DataTypeValue,
  Datastore as ReacthorDatastoreType,
  MessagingRole as MessagingRoleValue,
  Messaging as ReacthorMessagingType,
  GcpBucketStore as ReacthorGcpBucketStoreType
} from 'reacthor-db'

export const reacthorDbClient = new PrismaClient()

export { FileTypeValue, DataTypeValue, MessagingRoleValue }

export type { DataType, FileType, ReacthorUser, ReacthorOrganizationType, ReacthorDatastoreType, ReacthorMessagingType, ReacthorGcpBucketStoreType }
