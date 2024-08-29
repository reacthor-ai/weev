import { atom, useSetAtom } from 'jotai'

export const nodeIdAtom = atom<string>('')

export const useSetNodeIdAtom = () => useSetAtom(nodeIdAtom)
