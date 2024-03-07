import type { BrandVoice, Organization, Product, Project, User } from 'prisma'
import { PrismaClient, PromptType } from 'prisma'

export const prisma = new PrismaClient()

export type {
  User,
  Organization as OrganizationPrismaType,
  Project as ProjectType,
  PromptType,
  Product as ProductType,
  BrandVoice as BrandVoiceType
}
