import { reduce, split } from 'rambda'

export const truncateWords = (wordLimit: number, text: string) => {
  const reducer = (acc: any, char: string) => {
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

  const initialAccumulator: any = { result: '', words: 0 }
  const finalResult = reduce(reducer, initialAccumulator, split('', text))

  return finalResult.result
}