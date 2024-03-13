export const CONTROL_NET_SELECT = ['POSE', 'CANNY', 'DEPTH']
export const PRE_STYLE = ['CINEMATIC', 'VIBRANT', 'CREATIVE', 'NONE']

export const DEPTH = ['0.55 (Low)', '0.5 (Medium)', '0.45 (High)']
export const DEPTH_OF_FIELD = [
  {
    field: DEPTH[0],
    value: 0.55
  },
  {
    field: DEPTH[1],
    value: 0.50
  },
  {
    field: DEPTH[2],
    value: 0.45
  }
]

export const DIMENSIONS = ['512 × 768', '768 × 512', '1360 × 768', '768 × 1360', '512 * 512']
export const DIMENSIONS_FIELD = [
  {
    field: DIMENSIONS[0],
    value: { width: 512, height: 768 }
  },
  {
    field: DIMENSIONS[1],
    value: { width: 768, height: 512 }
  },
  {
    field: DIMENSIONS[2],
    value: { width: 1360, height: 768 }
  },
  {
    field: DIMENSIONS[3],
    value: { width: 768, height: 1360 }
  },
  {
    field: DIMENSIONS[4],
    value: { width: 512, height: 512 }
  }
]

export const DEFAULT_IMAGE_STRENGTH = 0.1