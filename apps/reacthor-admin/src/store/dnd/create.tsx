import { atom, useAtom } from 'jotai'

export const dndAtom = atom<string | null>(null)

export const useDndAtom = () => useAtom(dndAtom)
