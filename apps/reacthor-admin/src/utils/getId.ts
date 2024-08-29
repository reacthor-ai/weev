import { v4 as uuidV4 } from 'uuid'

export const getId = (type: string) => `${type}_${uuidV4().slice(0, 5)}`
