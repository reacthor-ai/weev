import type { BrandVoice, Image, Organization, Product, Project, Prompt, User } from 'prisma'
import { PrismaClient, PromptType } from 'prisma'

type ExtendedProductType = Product & {
  brandVoice?: BrandVoice
  prompt?: Prompt[],
  image?: Image[]
}

export const prisma = new PrismaClient()

export type {
  User,
  Organization as OrganizationPrismaType,
  Project as ProjectType,
  PromptType,
  ExtendedProductType as ProductType,
  BrandVoice as BrandVoiceType,
  Image as ImageType
}
