import type { ExerciseAnswers, ExerciseContent, ExercisePartContent } from './exerciseContent'
import type { ExercisePartId } from './paragraph11Catalog'

/** Restricted arithmetic for typed graph coordinates. No JavaScript evaluation. */
export function readCoordinate(text: string): number {
  const source = text.replaceAll('−', '-').replaceAll(',', '.').replaceAll('π', 'pi').replace(/\s/g, '')
  if (!source || source.length > 100) return NaN
  const tokens = source.match(/sqrt|cbrt|pi|\d+(?:\.\d+)?|[()+*/^-]/g) ?? []
  if (tokens.join('') !== source) return NaN
  let position = 0
  const take = (token: string) => tokens[position] === token && (++position > 0)
  function atom(): number {
    if (take('sqrt') || take('cbrt')) {
      const operation = tokens[position - 1]
      if (!take('(')) return NaN
      const value = sum()
      if (!take(')')) return NaN
      return operation === 'sqrt' ? Math.sqrt(value) : Math.cbrt(value)
    }
    if (take('(')) {
      const value = sum()
      return take(')') ? value : NaN
    }
    if (take('pi')) return Math.PI
    const token = tokens[position++]
    return token && /^\d/.test(token) ? Number(token) : NaN
  }
  function power(): number {
    const value = atom()
    return take('^') ? value ** unary() : value
  }
  function unary(): number {
    if (take('+')) return unary()
    if (take('-')) return -unary()
    return power()
  }
  function product(): number {
    let value = unary()
    while (position < tokens.length) {
      if (take('*')) value *= unary()
      else if (take('/')) value /= unary()
      else break
    }
    return value
  }
  function sum(): number {
    let value = product()
    while (position < tokens.length) {
      if (take('+')) value += product()
      else if (take('-')) value -= product()
      else break
    }
    return value
  }
  const result = sum()
  return position === tokens.length && Number.isFinite(result) ? result : NaN
}

type Base = { readonly tex: string; readonly value: number }
export type GraphPart = ExercisePartContent<'graph'> & { readonly bases: readonly Base[] }
const base = (tex: string, value: number): Base => ({ tex, value })
const letters = ['a', 'b', 'v', 'g'] as const
const id = (number: number, index: number): ExercisePartId => `11.${number}-${letters[index]}`
const result = (correct: boolean, feedback: string) => ({ correct, feedback })
const near = (value: number, expected: number) => Number.isFinite(value) && Math.abs(value - expected) <= 0.0001 * Math.abs(expected)

function fullInterval(intervals: ExerciseAnswers['graph']['curves'][number]['domain'], positive: boolean) {
  if (intervals.length !== 1) return false
  const { lower, upper } = intervals[0]
  return lower.value === (positive ? '0' : '-infinity') && upper.value === 'infinity' && !lower.included && !upper.included
}

function graphPart(number: number, index: number, bases: readonly Base[]): GraphPart {
  return {
    id: id(number, index), kind: 'graph', bases,
    prompt: [
      { kind: 'text', value: bases.length === 1 ? 'Постройте эскиз графика по опорным точкам. Задайте область определения, область значений и асимптоту.' : 'Постройте графики на общих осях по опорным точкам. Задайте области и асимптоту.' },
      { kind: 'formula', value: bases.map((item) => `y=\\left(${item.tex}\\right)^x`).join(',\\quad ') },
    ],
    checkAnswer: ({ curves }) => {
      if (curves.length !== bases.length || new Set(curves.map((curve) => curve.id)).size !== bases.length) return result(false, 'Постройте каждый из заданных графиков.')
      for (const [index, item] of bases.entries()) {
        const curve = curves.find((curve) => curve.id === `c${index + 1}`)
        if (!curve || curve.points.length !== 3 || curve.transformations.length !== 0) return result(false, 'Для каждого графика нужны три опорные точки без сдвига или растяжения.')
        if (curve.points.some((point) => !Number.isFinite(readCoordinate(point.y)))) return result(false, `График ${index + 1}: введите значения трёх опорных точек числами или выражениями.`)
        for (const x of [-1, 0, 1]) {
          const matches = curve.points.filter((point) => readCoordinate(point.x) === x)
          if (matches.length !== 1 || !near(readCoordinate(matches[0].y), item.value ** x)) {
            return result(false, x === 0 ? `График ${index + 1}: при x = 0 любая допустимая степень равна 1.` : `График ${index + 1}: проверьте основание. Оно ${item.value > 1 ? 'больше' : 'меньше'} 1. При x = −1 значение равно обратному основанию, при x = 1 — основанию.`)
          }
        }
        if (!fullInterval(curve.domain, false)) return result(false, 'Показательная функция определена при любом действительном x.')
        if (!fullInterval(curve.range, true)) return result(false, 'Степень положительного основания всегда положительна. Ноль не входит в область значений.')
        if (curve.asymptotes.length !== 1 || curve.asymptotes[0].axis !== 'y' || readCoordinate(curve.asymptotes[0].value) !== 0) return result(false, 'Горизонтальная асимптота имеет уравнение y = 0. График приближается к ней, но не пересекает её.')
      }
      return result(true, 'Точки, области и асимптота верны. Через (0; 1) проходит каждый график. Значения справа от нуля возрастают с основанием, слева — убывают.')
    },
  }
}

const graphRows: readonly (readonly (readonly Base[])[])[] = [
  [[base('\\sqrt2', Math.SQRT2)], [base('1/\\pi', 1 / Math.PI)], [base('\\sqrt7', Math.sqrt(7))], [base('1/\\sqrt6', 1 / Math.sqrt(6))]],
  [[base('\\pi', Math.PI)], [base('4-\\pi', 4 - Math.PI)], [base('\\sqrt\\pi', Math.sqrt(Math.PI))], [base('1/(4-\\pi)', 1 / (4 - Math.PI))]],
  [[base('\\sqrt8-\\sqrt2', Math.sqrt(8) - Math.SQRT2)], [base('\\sqrt[3]{24}-\\sqrt[3]4', Math.cbrt(24) - Math.cbrt(4))], [base('\\sqrt5-\\sqrt[3]5', Math.sqrt(5) - Math.cbrt(5))], [base('\\sqrt[5]{32.1}-\\sqrt3', 32.1 ** 0.2 - Math.sqrt(3))]],
  [[base('3', 3), base('8', 8)], [base('3/4', 0.75), base('1/2', 0.5)], [base('\\sqrt7', Math.sqrt(7)), base('5', 5), base('\\sqrt8', Math.sqrt(8))], [base('1/\\sqrt2', 1 / Math.SQRT2), base('1/2', 0.5), base('1/8', 0.125)]],
]

const graphExercises: readonly ExerciseContent[] = graphRows.map((parts, index) => ({
  exerciseId: `11.${13 + index}`, status: 'ready', parts: parts.map((bases, partIndex) => graphPart(13 + index, partIndex, bases)),
}))

type Exponent = { readonly tex: string; readonly value: number }
const exponent = (tex: string, value: number): Exponent => ({ tex, value })
const powerTex = (base: Base, exponent: Exponent) => `\\left(${base.tex}\\right)^{${exponent.tex}}`

function comparisonPart(number: number, index: number, base: Base, left: Exponent, right: Exponent): ExercisePartContent<'comparison'> {
  const expected = (left.value - right.value) * Math.log(base.value)
  const relation = expected < 0 ? 'less' : expected > 0 ? 'greater' : 'equal'
  const explanation = `Основание ${base.value > 1 ? 'больше' : 'меньше'} 1: функция ${base.value > 1 ? 'возрастает' : 'убывает'}. Левый показатель ${left.value < right.value ? 'меньше' : left.value > right.value ? 'больше' : 'равен правому'}${left.value === right.value ? '' : ' правого'}.`
  return {
    id: id(number, index), kind: 'comparison',
    prompt: [{ kind: 'text', value: 'Сравните левое и правое значения.' }, { kind: 'formula', value: `${powerTex(base, left)} \\quad ? \\quad ${powerTex(base, right)}` }],
    checkAnswer: (answer) => result(answer === relation, `${answer === relation ? 'Верно.' : 'Проверьте сравнение показателей и направление неравенства.'} ${explanation}`),
  }
}

const e = exponent
const comparisonRows: readonly { number: number; base: Base; pairs: readonly (readonly [Exponent, Exponent])[] }[] = [
  { number: 17, base: base('3', 3), pairs: [[e('1/3', 1/3), e('2/3', 2/3)], [e('1/2', .5), e('-1/2', -.5)], [e('4/5', .8), e('3/5', .6)], [e('1', 1), e('-3/2', -1.5)]] },
  { number: 18, base: base('5', 5), pairs: [[e('2/3', 2/3), e('4/5', .8)], [e('-7/3', -7/3), e('-6/5', -1.2)], [e('3/5', .6), e('4/7', 4/7)], [e('-3/8', -.375), e('-11/9', -11/9)]] },
  { number: 19, base: base('\\sqrt3', Math.sqrt(3)), pairs: [[e('0.3', .3), e('1/4', .25)], [e('-1/3', -1/3), e('-0.4', -.4)], [e('1.8', 1.8), e('2.1', 2.1)], [e('3.1', 3.1), e('\\sqrt{10}', Math.sqrt(10))]] },
  { number: 20, base: base('0.6', .6), pairs: [[e('0.2', .2), e('1/3', 1/3)], [e('\\sqrt5', Math.sqrt(5)), e('2.5', 2.5)], [e('-4.1', -4.1), e('-5', -5)], [e('-6.5', -6.5), e('0.1', .1)]] },
  { number: 21, base: base('3/7', 3/7), pairs: [[e('2/3', 2/3), e('3/5', .6)], [e('-6/7', -6/7), e('-10/11', -10/11)], [e('5/7', 5/7), e('3/11', 3/11)], [e('-1.6', -1.6), e('-3', -3)]] },
]

const comparisons: ExerciseContent[] = comparisonRows.map(({ number, base, pairs }) => ({ exerciseId: `11.${number}`, status: 'ready', parts: pairs.map(([left, right], index) => comparisonPart(number, index, base, left, right)) }))
comparisons.push({ exerciseId: '11.22', status: 'ready', parts: [
  comparisonPart(22, 0, base('1.3', 1.3), e('34', 34), e('40', 40)),
  comparisonPart(22, 1, base('7/9', 7/9), e('16.2', 16.2), e('-3', -3)),
  comparisonPart(22, 2, base('12.1', 12.1), e('\\sqrt8', Math.sqrt(8)), e('\\sqrt5', Math.sqrt(5))),
  comparisonPart(22, 3, base('0.65', .65), e('-\\sqrt2', -Math.SQRT2), e('1/2', .5)),
] })

export type OrderingPart = ExercisePartContent<'ordering'> & { readonly values: readonly { readonly id: string; readonly tex: string }[] }

function orderingPart(number: number, index: number, base: Base, exponents: readonly Exponent[], oneIndex = -1): OrderingPart {
  const values = exponents.map((exponent, index) => ({ id: `v${index + 1}`, tex: index === oneIndex ? '1' : powerTex(base, exponent) }))
  const expected = exponents.map((exponent, index) => ({ id: values[index].id, log: exponent.value * Math.log(base.value) })).sort((left, right) => left.log - right.log).map((value) => value.id)
  const explanation = `Основание положительно и ${base.value > 1 ? 'больше' : 'меньше'} 1. Порядок степеней ${base.value > 1 ? 'совпадает с порядком показателей' : 'противоположен порядку показателей'}. Число 1 соответствует нулевому показателю.`
  return {
    id: id(number, index), kind: 'ordering', values,
    prompt: [{ kind: 'text', value: 'Расположите значения по возрастанию.' }, { kind: 'formula', value: values.map((value) => value.tex).join(';\\quad ') }],
    checkAnswer: ({ valueIds }) => {
      const correct = valueIds.length === expected.length && valueIds.every((value, index) => value === expected[index])
      return result(correct, `${correct ? 'Порядок верен.' : 'Проверьте основание, знаки и порядок показателей.'} ${explanation}`)
    },
  }
}

const orderings: readonly ExerciseContent[] = [
  { exerciseId: '11.23', status: 'ready', parts: [
    orderingPart(23, 0, base('2', 2), [e('1/3', 1/3), e('-1/2', -.5), e('\\sqrt3', Math.sqrt(3)), e('-\\sqrt2', -Math.SQRT2), e('1.4', 1.4), e('0', 0)], 5),
    orderingPart(23, 1, base('0.3', .3), [e('9', 9), e('0', 0), e('-\\sqrt5', -Math.sqrt(5)), e('1/2', .5), e('-9', -9), e('1/3', 1/3)], 1),
  ] },
  { exerciseId: '11.24', status: 'ready', parts: [
    orderingPart(24, 0, base('\\sqrt3', Math.sqrt(3)), [e('2/3', 2/3), e('-\\sqrt2', -Math.SQRT2), e('1.2', 1.2), e('0', 0), e('\\sqrt2', Math.SQRT2), e('\\sqrt3', Math.sqrt(3))], 3),
    orderingPart(24, 1, base('\\sqrt[3]3-\\sqrt[3]2', Math.cbrt(3) - Math.cbrt(2)), [e('0.3', .3), e('0', 0), e('-0.2', -.2)]),
  ] },
  { exerciseId: '11.25', status: 'ready', parts: [
    orderingPart(25, 0, base('1/\\sqrt5', 1 / Math.sqrt(5)), [e('5/6', 5/6), e('-0.2', -.2), e('2/3', 2/3), e('-1/6', -1/6), e('1.3', 1.3), e('-2.1', -2.1)]),
    orderingPart(25, 1, base('\\frac1{\\sqrt[3]2}-\\frac1{\\sqrt2}', 1 / Math.cbrt(2) - 1 / Math.SQRT2), [e('0.1', .1), e('-0.5', -.5), e('-3.4', -3.4)]),
  ] },
]

export const graphComparisonExercises: readonly ExerciseContent[] = [...graphExercises, ...comparisons, ...orderings]
