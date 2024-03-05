import { cache } from 'react'
import { prisma } from '@/database'
import { getUser } from '@/database/user'

export const getBrandVoicesByOrgId = cache(async () => {
  const user = await getUser()

  const brandVoices = await prisma.organization.findMany({
    where: {
      id: user.organization[0].id
    },
    include: {
      brandVoice: true
    }
  })

  return brandVoices[0].brandVoice
})