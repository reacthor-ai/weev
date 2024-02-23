import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { reduce, split } from 'rambda'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type Acc = {
  result: string
  words: number
}

export const truncateWords = (wordLimit: number, text: string) => {
  const reducer = (acc: Acc, char: string) => {
    if (acc.words === wordLimit) {
      return acc
    }
    if (char === ' ') {
      acc.words += 1
    }
    if (acc.words < wordLimit || char !== ' ') {
      acc.result += char
    }
    return acc
  }

  const initialAccumulator: Acc = { result: '', words: 0 }
  const finalResult = reduce(reducer, initialAccumulator, split('', text))

  return finalResult.result
}
