import type { BrandVoice, Organization, Project, User } from 'prisma'
import { PrismaClient, PromptType } from 'prisma'

export const prisma = new PrismaClient()

export type {
  User,
  Organization as OrganizationPrismaType,
  Project as ProjectType,
  PromptType,
  BrandVoice as BrandVoiceType
}
