import { expect, test } from '@playwright/test'
import { graphComparisonExercises, readCoordinate } from '../app/src/content/graphComparison11'
import type { ExerciseAnswers, ExercisePartContent } from '../app/src/content/exerciseContent'
import { availableParagraph11Exercises } from '../app/src/content/exerciseContent'
import { recordParagraph11Result, restoreParagraph11Progress, summarizeParagraph11Progress } from '../app/src/content/paragraph11Progress'

test('11.13 checks constructed points, domain, range, and asymptote', () => {
  const part = graphComparisonExercises[0].parts[0] as ExercisePartContent<'graph'>
  const answer: ExerciseAnswers['graph'] = { curves: [{
    id: 'c1', points: [{ x: '-1', y: '1/sqrt(2)' }, { x: '0', y: '1' }, { x: '1', y: 'sqrt(2)' }],
    transformations: [],
    domain: [{ lower: { value: '-infinity', included: false }, upper: { value: 'infinity', included: false } }],
    range: [{ lower: { value: '0', included: false }, upper: { value: 'infinity', included: false } }],
    asymptotes: [{ axis: 'y', value: '0' }],
  }] }
  expect(part.checkAnswer(answer).correct).toBe(true)
  expect(part.checkAnswer({ curves: [] }).correct).toBe(false)
  expect(part.checkAnswer({ curves: [{ ...answer.curves[0], points: [{ x: '-1', y: 'sqrt(2)' }, { x: '0', y: '1' }, { x: '1', y: '1/sqrt(2)' }] }] }).correct).toBe(false)
  expect(part.checkAnswer({ curves: [{ ...answer.curves[0], range: answer.curves[0].domain }] }).correct).toBe(false)
})

test('all 46 parts enter the catalog in source order with medium marks', () => {
  const available = availableParagraph11Exercises(graphComparisonExercises)
  expect(available.map((exercise) => exercise.id)).toEqual(['11.13', '11.14', '11.15', '11.16', '11.17', '11.18', '11.19', '11.20', '11.21', '11.22', '11.23', '11.24', '11.25'])
  expect(available.flatMap((exercise) => exercise.parts)).toHaveLength(46)
  expect(available.filter((exercise) => exercise.level === 'medium').map((exercise) => exercise.id)).toEqual(['11.15', '11.23', '11.24', '11.25'])
  let solved = restoreParagraph11Progress(null)
  for (const exercise of available) for (const part of exercise.parts) {
    expect(recordParagraph11Result(solved, part.id, { correct: false, feedback: 'Retry' })).toBe(solved)
    solved = recordParagraph11Result(solved, part.id, { correct: true, feedback: 'Correct' })
    expect(recordParagraph11Result(solved, part.id, { correct: false, feedback: 'Retry' })).toBe(solved)
  }
  expect(summarizeParagraph11Progress(solved)).toMatchObject({ solvedParts: 46, totalParts: 284, completedExerciseIds: available.map((exercise) => exercise.id) })
})

test('all comparison answers match independently worked exponent comparisons', () => {
  const expected = [
    ['less', 'greater', 'greater', 'greater'],
    ['less', 'less', 'greater', 'greater'],
    ['greater', 'greater', 'less', 'less'],
    ['greater', 'greater', 'less', 'greater'],
    ['less', 'less', 'less', 'less'],
    ['less', 'less', 'greater', 'greater'],
  ] as const
  for (const [row, answers] of expected.entries()) for (const [index, answer] of answers.entries()) {
    const part = graphComparisonExercises.find((exercise) => exercise.exerciseId === `11.${17 + row}`)!.parts[index] as ExercisePartContent<'comparison'>
    for (const candidate of ['less', 'equal', 'greater'] as const) expect(part.checkAnswer(candidate).correct, `${part.id}: ${candidate}`).toBe(candidate === answer)
    expect(part.checkAnswer('equal').feedback).toContain('Основание')
  }
})

test('every graph accepts source coordinates and rejects reciprocal, omitted, and extraneous curves', () => {
  // Independently transcribed bases, in book part and curve order.
  const bases = [
    [['sqrt(2)'], ['1/pi'], ['sqrt(7)'], ['1/sqrt(6)']],
    [['pi'], ['4-pi'], ['sqrt(pi)'], ['1/(4-pi)']],
    [['sqrt(8)-sqrt(2)'], ['cbrt(24)-cbrt(4)'], ['sqrt(5)-cbrt(5)'], ['32.1^(1/5)-sqrt(3)']],
    [['3', '8'], ['3/4', '1/2'], ['sqrt(7)', '5', 'sqrt(8)'], ['1/sqrt(2)', '1/2', '1/8']],
  ]
  for (const [row, parts] of bases.entries()) for (const [index, expressions] of parts.entries()) {
    const part = graphComparisonExercises[row].parts[index] as ExercisePartContent<'graph'>
    const curves: ExerciseAnswers['graph']['curves'] = expressions.map((expression, index) => ({
      id: `c${index + 1}`, points: [{ x: '-1', y: `1/(${expression})` }, { x: '0', y: '1' }, { x: '1', y: expression }], transformations: [],
      domain: [{ lower: { value: '-infinity', included: false }, upper: { value: 'infinity', included: false } }],
      range: [{ lower: { value: '0', included: false }, upper: { value: 'infinity', included: false } }],
      asymptotes: [{ axis: 'y', value: '0' }],
    }))
    expect(part.checkAnswer({ curves }).correct, part.id).toBe(true)
    expect(part.checkAnswer({ curves: curves.slice(1) }).correct).toBe(false)
    expect(part.checkAnswer({ curves: [...curves, curves[0]] }).correct).toBe(false)
    expect(part.checkAnswer({ curves: curves.map((curve) => ({ ...curve, points: [...curve.points].map((point) => ({ ...point, y: point.x === '1' ? '1' : point.y })) })) }).correct).toBe(false)
    expect(part.checkAnswer({ curves: curves.map((curve) => ({ ...curve, range: [{ lower: { value: '0', included: true }, upper: { value: 'infinity', included: false } }] })) }).correct).toBe(false)
    expect(part.checkAnswer({ curves: curves.map((curve) => ({ ...curve, asymptotes: [{ axis: 'x', value: '0' }] })) }).correct).toBe(false)
  }
})

test('ordering follows exponents for bases above one and reverses them below one', () => {
  const orders = [
    ['11.23', 0, ['v4', 'v2', 'v6', 'v1', 'v5', 'v3']],
    ['11.23', 1, ['v1', 'v4', 'v6', 'v2', 'v3', 'v5']],
    ['11.24', 0, ['v2', 'v4', 'v1', 'v3', 'v5', 'v6']],
    ['11.24', 1, ['v1', 'v2', 'v3']],
    ['11.25', 0, ['v5', 'v1', 'v3', 'v4', 'v2', 'v6']],
    ['11.25', 1, ['v1', 'v2', 'v3']],
  ] as const
  for (const [exerciseId, index, valueIds] of orders) {
    const part = graphComparisonExercises.find((item) => item.exerciseId === exerciseId)!.parts[index] as ExercisePartContent<'ordering'>
    expect(part.checkAnswer({ valueIds }).correct, `${exerciseId}-${index}`).toBe(true)
    expect(part.checkAnswer({ valueIds: [...valueIds].reverse() }).correct).toBe(false)
    expect(part.checkAnswer({ valueIds: valueIds.map(() => 'v1') }).correct).toBe(false)
    expect(part.checkAnswer({ valueIds: valueIds.slice(1) }).correct).toBe(false)
  }
})

test('coordinate arithmetic accepts radicals and rejects invalid expressions', () => {
  expect(readCoordinate('32.1^(1/5)-sqrt(3)')).toBeCloseTo(.269197648, 7)
  expect(readCoordinate('1/(4-pi)')).toBeCloseTo(1.164948, 5)
  expect(readCoordinate('-2^2')).toBe(-4)
  expect(readCoordinate('2^-2')).toBe(.25)
  expect(readCoordinate('cbrt(24)-cbrt(4)')).toBeCloseTo(1.297098089, 7)
  for (const text of ['', '1/0', 'sqrt(-1)', 'Math.PI', '1+1junk', '2**3', '()', '1e309']) expect(Number.isNaN(readCoordinate(text))).toBe(true)
})

test('11.17 and 11.18 use their own source bases and fractional exponents', () => {
  const comparison = (exercise: number, index: number) => graphComparisonExercises.find((item) => item.exerciseId === `11.${exercise}`)!.parts[index] as ExercisePartContent<'comparison'>
  expect(comparison(17, 0).checkAnswer('less').correct).toBe(true)
  expect(comparison(17, 1).checkAnswer('greater').correct).toBe(true)
  expect(comparison(18, 0).checkAnswer('less').correct).toBe(true)
  expect(comparison(18, 1).checkAnswer('less').correct).toBe(true)
  expect(comparison(18, 2).checkAnswer('greater').correct).toBe(true)
  expect(comparison(18, 3).checkAnswer('greater').correct).toBe(true)
  expect(comparison(18, 0).prompt.find((block) => block.kind === 'formula')?.value).toContain('5')
  expect(comparison(17, 0).checkAnswer('equal').correct).toBe(false)
})
