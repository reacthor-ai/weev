import {
  CONTROL_NET_SELECT,
  DEFAULT_IMAGE_STRENGTH,
  DEPTH,
  DEPTH_OF_FIELD,
  DIMENSIONS,
  DIMENSIONS_FIELD,
  PRE_STYLE
} from '@/lib/create-details/Product/constant'
import { useMemo, useState } from 'react'
import { uuid } from 'uuidv4'
import { PRODUCT_IMAGE_PREFIX, UPLOADED_IMAGE_PREFIX } from '@/shared-utils/constant/constant-default'

type UseProductImageControllersProps = {
  organizationId: string
  files: File[]
  userId: string
}

export const useProductImageControllers = (props: UseProductImageControllersProps) => {
  const { userId, organizationId, files } = props

  const [controlNetType, setControlNetType] = useState(CONTROL_NET_SELECT[0])
  const [preStyle, setPreStyle] = useState(PRE_STYLE[0])
  const [depthOfField, setDepthOfField] = useState(DEPTH[0])
  const [imageStrength, setImageStrength] = useState([DEFAULT_IMAGE_STRENGTH])
  const [dimensions, setDimensions] = useState(DIMENSIONS[0])

  const controlNetDetails = {
    'POSE': 'Scans it to identify human or humanoid figures. It then seeks to mimic these poses in your generated image, offering a seamless way to achieve precise character positioning. The feature is versatile and can be applied to a variety of projects, from game development to digital art and more',
    'CANNY': 'You can use this to put an object in a certain environment. Higher strength values preserve more lines, yielding a detailed and intricate result. This makes it ideal for either refining existing line art or creating new artwork from scratch.',
    'DEPTH': 'This allows you to emphasize specific objects in the foreground, subtly integrate elements into the background. Use this in cases where you’re working on a landscape image and you want the mountains in the background to appear distant without affecting the foreground objects. Or when you’re editing a portrait and aim to make the subject stand out against a softly blurred background.'
  }

  const depthOfFieldDetails = {
    [DEPTH[0]]: '0.55 (Low): Keeps everything pretty sharp, great for full scenes like landscapes.',
    [DEPTH[1]]: '0.5 (Medium): Softens the edges a bit, making your subject pop with some background blur.',
    [DEPTH[2]]: '0.45 (High): Really focuses in on your subject, blurring out everything else for that dramatic look.'
  }

  const dimensionsValue = useMemo(() => {
    return DIMENSIONS_FIELD.find(val => val.field === dimensions) || DIMENSIONS_FIELD[0]
  }, [dimensions])

  const depthValue = useMemo(() => {
    return DEPTH_OF_FIELD.find(val => val.field === depthOfField) || DEPTH_OF_FIELD[0]
  }, [depthOfField])

  const uploadFile = async () => {
    const params = {
      fileId: uuid(),
      name: PRODUCT_IMAGE_PREFIX,
      organizationId,
      userId
    }

    const productFileName = `${params.organizationId}/${params.name}-${params.fileId}`
    const file = files[0]
    const filename = encodeURIComponent(productFileName)

    const res = await fetch(`/dashboard/api/storage?fileName=${filename}&type=upload`)
    const { response: { url, fields } } = await res.json()

    const formData = new FormData()
    Object.entries({ ...fields, file }).forEach(([key, value]: any) => {
      formData.append(key, value)
    })

    const upload = await fetch(url, {
      method: 'POST',
      body: formData
    })

    if (upload.ok) {
      const ee = await fetch(`/dashboard/api/storage?fileName=${filename}&type=read`)
      if (ee.ok) {
        const url = await ee.json()
        const productImage = { gcpFileId: `${params.name}-${params.fileId}`, url: url?.response }
        return productImage
      } else {
        const error = { gcpFileId: `${params.name}-${params.fileId}`, url: null }
        return error
      }
    }

    return { gcpFileId: `${params.name}-${params.fileId}`, url: null }
  }

  const uploadImgGCP = async (fileBlob: Blob) => {  // fileBlob is either a File or Blob object
    const params = {
      fileId: uuid(),
      name: UPLOADED_IMAGE_PREFIX,
      organizationId,
      userId
    }

    const productFileName = `${params.organizationId}/${params.name}-${params.fileId}`
    const filename = encodeURIComponent(productFileName)

    const res = await fetch(`/dashboard/api/storage?fileName=${filename}&type=upload`)
    const { response: { url, fields } } = await res.json()

    const formData = new FormData()
    Object.entries({ ...fields, file: fileBlob }).forEach(([key, value]: any) => {
      formData.append(key, value)
    })

    const upload = await fetch(url, {
      method: 'POST',
      body: formData
    })

    if (upload.ok) {
      const ee = await fetch(`/dashboard/api/storage?fileName=${filename}&type=read`)
      if (ee.ok) {
        const url = await ee.json()
        const productImage = { gcpFileId: `${params.name}-${params.fileId}`, url: url?.response }
        return productImage
      } else {
        const error = { gcpFileId: `${params.name}-${params.fileId}`, url: null }
        return error
      }
    } else {
      return { gcpFileId: `${params.name}-${params.fileId}`, url: null }
    }
  }

  return {
    uploadFile,
    uploadImgGCP,
    depthValue,
    depthOfField,
    dimensionsValue,
    depthOfFieldDetails,
    controlNetDetails,
    imageStrength,
    setImageStrength,
    setDimensions,
    setControlNetType,
    setDepthOfField,
    setPreStyle,
    controlNetType,
    preStyle
  }
}