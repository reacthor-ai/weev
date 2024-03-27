'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BrandIdentityCreateDetails } from '@/lib/create-details/Brand/BrandIdentity'
import { SearchBrandVoice } from '@/lib/create-details/Brand/SearchBrandVoice'

export type BrandProps = {
  organizationId: string
  id: string
  clerkId: string
}

export const Brand = (props: BrandProps) => {
  const { organizationId, id, clerkId } = props
  return (
    <Tabs defaultValue='brand-voice'>
      <TabsList className='grid w-full grid-cols-2'>
        <TabsTrigger value='brand-voice'>Brand Voice</TabsTrigger>
        <TabsTrigger value='search-brand-voice'>Search Brand Voice</TabsTrigger>
      </TabsList>
      <TabsContent value='brand-voice'>
        <BrandIdentityCreateDetails organizationId={organizationId} id={id} clerkId={clerkId} />
      </TabsContent>
      <TabsContent value='search-brand-voice'>
        <SearchBrandVoice organizationId={organizationId} id={id} clerkId={clerkId} />
      </TabsContent>
    </Tabs>
  )
}