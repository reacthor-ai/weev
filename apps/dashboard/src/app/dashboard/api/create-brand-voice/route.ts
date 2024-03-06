import { prisma } from '@/database'

export async function POST(req: Request) {
  const params = await req.json()

  const {
    organizationId,
    clerkId,
    brandVoice: {
      title,
      description,
      type
    },

    prompt: {
      text: {
        audience,
        voice,
        emotions,
        photoGuidelines
      }
    },
    link
  } = params

  const data = await prisma.organization.update({
    where: {
      id: organizationId,
      user: {
        clerkId
      }
    },
    data: {
      brandVoice: {
        create: [
          {
            title,
            description,
            type,
            link,
            prompt: {
              createMany: {
                data: [
                  {
                    text: audience,
                    type: 'BRAND_TEXT'
                  },
                  {
                    text: voice,
                    type: 'BRAND_TEXT'
                  },
                  {
                    text: emotions,
                    type: 'BRAND_TEXT'
                  },
                  {
                    text: photoGuidelines,
                    type: 'BRAND_TEXT'
                  }
                ]
              }
            }
          }
        ]
      }
    }
  })

  return Response.json(data)
}
