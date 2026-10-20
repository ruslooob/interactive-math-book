import { expect, test } from '@playwright/test'
import { availableParagraph11Exercises, paragraph11ExerciseContent } from '../app/src/content/exerciseContent'
import { powerValueExercises } from '../app/src/content/powerValueExercises'
import { numericAnswer } from '../app/src/lib/numericAnswer'
import { loadParagraph11Progress, saveParagraph11Progress, submitParagraph11Answer, summarizeParagraph11Progress } from '../app/src/content/paragraph11Progress'
import type { ExercisePartId } from '../app/src/content/paragraph11Catalog'

test('numeric answers accept decimal commas and radicals without executing code', () => {
  for (const [input, expected] of [['0,6', 0.6], ['root(3;8)', 2], ['root(3,8)', 2], ['8sqrt(2)', 8 * Math.SQRT2], ['-2^2', -4], ['2^-3', 0.125], ['2^3^2', 512]] as const) {
    expect(numericAnswer(input), input).toBeCloseTo(expected, 12)
  }
  for (const input of ['', '1/0', 'sqrt(-2)', 'root(0;8)', '2 trailing', '2^^3', '2+', 'globalThis.alert(1)', '0/0', '1e309', '('.repeat(201)]) {
    expect(numericAnswer(input), input).toBeNull()
  }
})

test('11.1(a) checks a calculated product and permits a corrected answer', () => {
  const part = paragraph11ExerciseContent.find((exercise) => exercise.exerciseId === '11.1')?.parts[0]
  expect(part?.kind).toBe('calculated-values')
  if (part?.kind !== 'calculated-values') throw new Error('11.1(a) is unavailable')
  expect(part.checkAnswer({ values: ['64'] }).correct).toBe(false)
  expect(part.checkAnswer({ values: ['32'] }).correct).toBe(true)
  expect(part.checkAnswer({ values: ['2^5'] }).correct).toBe(true)
})

test('11.4 checks decimal and radical quotients', () => {
  const exercise = paragraph11ExerciseContent.find((item) => item.exerciseId === '11.4')
  expect(exercise?.parts).toHaveLength(4)
  const answers = ['0,6', '1.44', '1/9', '2/7']
  exercise?.parts.forEach((part, index) => {
    if (part.kind !== 'calculated-values') throw new Error('Expected calculated values')
    expect(part.checkAnswer({ values: ['0'] }).correct).toBe(false)
    expect(part.checkAnswer({ values: [answers[index]] }).correct).toBe(true)
  })
})

test('11.8 and 11.9 distinguish fixed bases from fixed exponents', () => {
  for (const number of [8, 9]) {
    const exercise = paragraph11ExerciseContent.find((item) => item.exerciseId === `11.${number}`)
    expect(exercise?.parts).toHaveLength(4)
    exercise?.parts.forEach((part, index) => {
      if (part.kind !== 'choices') throw new Error('Expected classification')
      const expected = index === 0 || index === 3 ? 'exponential' : 'not-exponential'
      const wrong = expected === 'exponential' ? 'not-exponential' : 'exponential'
      expect(part.checkAnswer({ selectedIds: [wrong] }).correct).toBe(false)
      expect(part.checkAnswer({ selectedIds: [expected] }).correct).toBe(true)
      expect(part.checkAnswer({ selectedIds: [expected, wrong] }).correct).toBe(false)
    })
  }
})

test('11.10 checks all three direct values in the source order', () => {
  const exercise = paragraph11ExerciseContent.find((item) => item.exerciseId === '11.10')
  expect(exercise?.parts).toHaveLength(4)
  const answers = [
    ['343', '1/7', 'sqrt(7)'], ['sqrt(2)/4', '1/2', 'sqrt(2)'],
    ['1', '9', '9sqrt(3)'], ['27/8', '9/4', '32/243'],
  ]
  exercise?.parts.forEach((part, index) => {
    if (part.kind !== 'calculated-values') throw new Error('Expected function values')
    expect(part.checkAnswer({ values: [...answers[index]].reverse() }).correct).toBe(false)
    expect(part.checkAnswer({ values: answers[index].slice(0, 2) }).correct).toBe(false)
    expect(part.checkAnswer({ values: answers[index] }).correct).toBe(true)
  })
})

test('11.11 and 11.12 recover arguments for bases above and below one', () => {
  const answers = [['4', '7/2', '-1/2', '-11/2'], ['2', '5/2', '-3', '-9/2']]
  answers.forEach((values, group) => {
    const exercise = paragraph11ExerciseContent.find((item) => item.exerciseId === `11.${11 + group}`)
    expect(exercise?.parts).toHaveLength(4)
    exercise?.parts.forEach((part, index) => {
      if (part.kind !== 'calculated-values') throw new Error('Expected argument')
      expect(part.checkAnswer({ values: ['0'] }).correct).toBe(false)
      expect(part.checkAnswer({ values: [values[index]] }).correct).toBe(true)
    })
  })
})

// Worked results from printed pages 62–63, independent of the content factories.
const workedValues = [
  [['32'], ['343'], ['3'], ['27/64']],
  [['5'], ['2'], ['1/49'], ['9']],
  [['2'], ['16'], ['2'], ['8/27']],
  [['3/5'], ['36/25'], ['1/9'], ['2/7']],
  [['4'], ['1/7'], ['27'], ['4/3']],
  [['1/2'], ['16/81'], ['27'], ['3/2']],
  [['1'], ['1/10'], ['9root(3;3)'], ['root(3;2)']],
  null, null,
  [['343', '1/7', 'sqrt(7)'], ['1/(2sqrt(2))', '1/2', 'sqrt(2)'], ['1', '9', '9sqrt(3)'], ['27/8', '9/4', '32/243']],
  [['4'], ['3.5'], ['-0.5'], ['-5.5']],
  [['2'], ['2.5'], ['-3'], ['-4.5']],
]

test('all 48 parts check wrong, correct, replay, and stored solved results', () => {
  const exercises = availableParagraph11Exercises(powerValueExercises)
  expect(exercises.map((exercise) => exercise.id)).toEqual(Array.from({ length: 12 }, (_, i) => `11.${i + 1}`))
  expect(exercises.flatMap((exercise) => exercise.parts)).toHaveLength(48)
  let solved: ReadonlySet<ExercisePartId> = new Set()
  exercises.forEach((exercise, exerciseIndex) => {
    expect(exercise.level).toBe('simple')
    expect(exercise.printedPage).toBe(exerciseIndex < 5 ? 62 : 63)
    expect(exercise.parts.map((part) => part.letter)).toEqual(['а', 'б', 'в', 'г'])
    exercise.content.parts.forEach((part, partIndex) => {
      const count = solved.size
      if (part.kind === 'calculated-values') {
        const answer = workedValues[exerciseIndex]![partIndex]
        const wrong = answer.map(() => '0')
        const failed = submitParagraph11Answer(part, { values: wrong }, solved)
        expect(failed.result.correct, part.id).toBe(false)
        expect(failed.result.feedback.length, part.id).toBeGreaterThan(20)
        expect(failed.solvedIds.size).toBe(count)
        const passed = submitParagraph11Answer(part, { values: answer }, failed.solvedIds)
        expect(passed.result.correct, part.id).toBe(true)
        solved = passed.solvedIds
        expect(submitParagraph11Answer(part, { values: wrong }, solved).solvedIds).toBe(solved)
      } else if (part.kind === 'choices') {
        const expected = partIndex === 0 || partIndex === 3 ? 'exponential' : 'not-exponential'
        const wrong = expected === 'exponential' ? 'not-exponential' : 'exponential'
        const failed = submitParagraph11Answer(part, { selectedIds: [wrong] }, solved)
        expect(failed.result.correct, part.id).toBe(false)
        expect(failed.solvedIds.size).toBe(count)
        const passed = submitParagraph11Answer(part, { selectedIds: [expected] }, failed.solvedIds)
        expect(passed.result.correct, part.id).toBe(true)
        solved = passed.solvedIds
        expect(submitParagraph11Answer(part, { selectedIds: [wrong] }, solved).solvedIds).toBe(solved)
      } else throw new Error(`Unsupported answer kind: ${part.kind}`)
      expect(solved.size, part.id).toBe(count + 1)
    })
  })
  let serialized: string | null = null
  const storage = { getItem: () => serialized, setItem: (_key: string, value: string) => { serialized = value } }
  saveParagraph11Progress(solved, storage)
  const restored = loadParagraph11Progress(storage)
  expect([...restored]).toEqual([...solved])
  expect(summarizeParagraph11Progress(restored)).toMatchObject({ solvedParts: 48, totalParts: 284, allPartsSolved: false })
  expect(summarizeParagraph11Progress(restored).completedExerciseIds).toHaveLength(12)
})
