import { expect, test } from '@playwright/test'
import { paragraph11Catalog } from '../app/src/content/paragraph11Catalog'
import { availableParagraph11Exercises, type ExerciseContent, type ExercisePartContent } from '../app/src/content/exerciseContent'
import { submitParagraph11Answer, loadParagraph11Progress, saveParagraph11Progress, recordParagraph11Result, restoreParagraph11Progress, summarizeParagraph11Progress, paragraph11ProgressStorageKey } from '../app/src/content/paragraph11Progress'

test('catalog preserves every exercise, source page, part letter, and book level', () => {
  const exercisesByPage = [
    [62, 1, 5], [63, 6, 12], [64, 13, 18], [65, 19, 25],
    [66, 26, 33], [67, 34, 38], [68, 39, 43], [69, 44, 50],
    [70, 51, 55], [71, 56, 65], [72, 66, 72], [73, 73, 78],
  ]
  // Independent transcription of the marks and part counts in the scan.
  const twoPartNumbers = [23, 24, 25, 37, 38, 51, 52, 53, 54, 55, 57, 58, 64, 78]
  const mediumNumbers = [15, 23, 24, 25, 28, 35, 36, 39, 40, 44, 45, 46, 47,
    50, 51, 52, 53, 54, 55, 56, 57, 60, 61, 62, 63, 64, 65, 66, 69, 70, 71, 72, 73, 74]
  const difficultNumbers = [58, 75, 76, 77, 78]

  expect(paragraph11Catalog).toHaveLength(78)
  for (const [page, first, last] of exercisesByPage) {
    for (let number = first; number <= last; number += 1) {
      const exercise = paragraph11Catalog[number - 1]
      expect(exercise.id).toBe(`11.${number}`)
      expect(exercise.printedPage).toBe(page)
      expect(exercise.level).toBe(difficultNumbers.includes(number) ? 'difficult' : mediumNumbers.includes(number) ? 'medium' : 'simple')
      expect(exercise.parts.map((part) => part.letter)).toEqual(twoPartNumbers.includes(number) ? ['а', 'б'] : ['а', 'б', 'в', 'г'])
    }
  }
  const parts = paragraph11Catalog.flatMap((exercise) => exercise.parts)
  expect(parts).toHaveLength(284)
  expect(new Set(parts.map((part) => part.id)).size).toBe(284)
  expect(paragraph11Catalog[77].practiceGroup).toBe('find-integer-values')
})

test('first correct result solves a part and replay cannot remove or duplicate it', () => {
  const empty = restoreParagraph11Progress(null)
  const wrong = { correct: false, feedback: 'Check the exponent.' } as const
  const correct = { correct: true, feedback: 'The value is correct.' } as const
  expect(recordParagraph11Result(empty, '11.1-a', wrong).size).toBe(0)
  const solved = recordParagraph11Result(empty, '11.1-a', correct)
  expect([...solved]).toEqual(['11.1-a'])
  expect(recordParagraph11Result(solved, '11.1-a', wrong)).toBe(solved)
  expect(recordParagraph11Result(solved, '11.1-a', correct)).toBe(solved)
  expect(recordParagraph11Result(solved, '11.999-a', correct)).toBe(solved)
  expect(empty.size).toBe(0)
})

test('a new learner starts with no solved parts', () => {
  expect(summarizeParagraph11Progress(restoreParagraph11Progress(null))).toMatchObject({
    solvedParts: 0,
    totalParts: 284,
    allPartsSolved: false,
    completedExerciseIds: [],
  })
})

test('saved progress restores valid parts once and rejects stale or malformed data', () => {
  const saved = new Map<string, string>()
  const storage = {
    getItem: (key: string) => saved.get(key) ?? null,
    setItem: (key: string, value: string) => { saved.set(key, value) },
  }
  storage.setItem('interactive-math-book:paragraph-11-progress:v1', '["11.17-a"]')
  expect(loadParagraph11Progress(storage).size).toBe(0)
  storage.setItem(paragraph11ProgressStorageKey, '["11.1-a","11.1-a","11.64-b","11.64-v","11.999-a",{},null]')
  const restored = loadParagraph11Progress(storage)
  expect([...restored]).toEqual(['11.1-a', '11.64-b'])
  saveParagraph11Progress(restored, storage)
  expect([...loadParagraph11Progress(storage)]).toEqual(['11.1-a', '11.64-b'])
  expect(storage.getItem(paragraph11ProgressStorageKey)).toBe('["11.1-a","11.64-b"]')
  for (const malformed of ['{', '{}', 'null', '42', '"11.1-a"']) {
    expect(restoreParagraph11Progress(malformed).size).toBe(0)
  }
  const unavailable = {
    getItem: () => { throw new Error('Storage unavailable') },
    setItem: () => { throw new Error('Storage unavailable') },
  }
  expect(loadParagraph11Progress(unavailable).size).toBe(0)
  expect(() => saveParagraph11Progress(restored, unavailable)).not.toThrow()
})

test('exercise, group, and section completion follow solved parts rather than attempts', () => {
  const partial = summarizeParagraph11Progress(new Set(['11.64-a', 'stale']))
  expect(partial.completedExerciseIds).not.toContain('11.64')
  const completeExercise = summarizeParagraph11Progress(new Set(['11.64-a', '11.64-b']))
  expect(completeExercise.completedExerciseIds).toEqual(['11.64'])
  expect(completeExercise.groups.find((group) => group.id === 'solve-equation')).toEqual({
    id: 'solve-equation', solvedParts: 2, totalParts: 30,
  })
  const allIds = paragraph11Catalog.flatMap((exercise) => exercise.parts.map((part) => part.id))
  const oneRemaining = summarizeParagraph11Progress(new Set(allIds.slice(0, -1)))
  expect(oneRemaining.allPartsSolved).toBe(false)
  expect(oneRemaining.completedExerciseIds).toHaveLength(77)
  const complete = summarizeParagraph11Progress(new Set([...allIds, 'stale']))
  expect(complete).toMatchObject({ solvedParts: 284, totalParts: 284, allPartsSolved: true })
  expect(complete.completedExerciseIds).toHaveLength(78)
})

function valueContent(exerciseId: '11.1' | '11.64'): ExerciseContent {
  const ids = exerciseId === '11.1' ? ['11.1-a', '11.1-b', '11.1-v', '11.1-g'] as const : ['11.64-a', '11.64-b'] as const
  return {
    exerciseId, status: 'ready',
    parts: ids.map((id): ExercisePartContent<'calculated-values'> => ({
      id, kind: 'calculated-values', prompt: [{ kind: 'formula', value: '2^3' }],
      checkAnswer: ({ values }) => values.length === 1 && values[0] === '8'
        ? { correct: true, feedback: 'The value is 8.' }
        : { correct: false, feedback: 'Apply the exponent to the base, rather than multiplying them.' },
    })),
  }
}

test('only complete ready exercises enter the learner route, in catalog order', () => {
  const first = valueContent('11.1')
  const later = valueContent('11.64')
  expect(availableParagraph11Exercises([later, first]).map((exercise) => exercise.id)).toEqual(['11.1', '11.64'])
  expect(availableParagraph11Exercises([{ ...first, status: 'draft' }])).toEqual([])
  expect(availableParagraph11Exercises([{ ...first, parts: first.parts.slice(1) }])).toEqual([])
  expect(availableParagraph11Exercises([{ ...first, parts: [first.parts[0], first.parts[0], ...first.parts.slice(2)] }])).toEqual([])
  expect(availableParagraph11Exercises([{ ...first, parts: [...first.parts, later.parts[0]] }])).toEqual([])
  expect(availableParagraph11Exercises([{ ...first, parts: first.parts.map((part) => ({ ...part, prompt: [] })) }])).toEqual([])
  expect(availableParagraph11Exercises([first, first])).toEqual([])
  expect(availableParagraph11Exercises([{ ...first, exerciseId: '11.999' }])).toEqual([])
})

test('answer checks give specific feedback and keep first correct progress during retries', () => {
  const part: ExercisePartContent<'calculated-values'> = valueContent('11.1').parts[0] as ExercisePartContent<'calculated-values'>
  const wrong = submitParagraph11Answer(part, { values: ['6'] }, restoreParagraph11Progress(null))
  expect(wrong.result).toEqual({ correct: false, feedback: 'Apply the exponent to the base, rather than multiplying them.' })
  expect(wrong.solvedIds.size).toBe(0)
  const correct = submitParagraph11Answer(part, { values: ['8'] }, wrong.solvedIds)
  expect(correct.result).toEqual({ correct: true, feedback: 'The value is 8.' })
  expect([...correct.solvedIds]).toEqual(['11.1-a'])
  const retry = submitParagraph11Answer(part, { values: ['6'] }, correct.solvedIds)
  expect(retry.result.correct).toBe(false)
  expect(retry.solvedIds).toBe(correct.solvedIds)
})
