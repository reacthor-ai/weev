import type { Organization, Project, User } from 'prisma'
import { PrismaClient } from 'prisma'

export const prisma = new PrismaClient()

export type { User, Organization as OrganizationPrismaType, Project as ProjectType }
