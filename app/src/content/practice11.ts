export type ComparisonAnswer = 'less' | 'equal' | 'greater'

export type ComparisonSubpoint = {
  id: string
  exercise: string
  subpoint: string
  left: string
  right: string
  answer: ComparisonAnswer
  success: string
}

export type ParagraphPageSummary = {
  id: string
  title: string
  total?: number
  initiallySolved?: number
  kind: 'theory' | 'comparison' | 'placeholder'
}

export const paragraph11ProgressStorageKey = 'interactive-math-book:paragraph-11-progress:v1'
export const paragraph11TotalSubpoints = 282

// The initial snapshot includes results the learner earned before opening this page.
export const paragraph11InitialProgress = {
  solvedSubpointsOutsideListedPages: 54,
} as const

export const comparisonSubpoints: ComparisonSubpoint[] = [
  {
    id: '11.17-a',
    exercise: '11.17',
    subpoint: 'а',
    left: String.raw`3^{\frac{1}{8}}`,
    right: String.raw`3^{\frac{2}{3}}`,
    answer: 'less',
    success: 'Верно: при основании больше единицы большему показателю соответствует большее значение функции.',
  },
  {
    id: '11.17-b',
    exercise: '11.17',
    subpoint: 'б',
    left: String.raw`4^{0{,}2}`,
    right: String.raw`4^{0{,}5}`,
    answer: 'less',
    success: 'Верно: основание больше единицы, поэтому достаточно сравнить показатели.',
  },
  {
    id: '11.17-v',
    exercise: '11.17',
    subpoint: 'в',
    left: String.raw`0{,}7^2`,
    right: String.raw`0{,}7^3`,
    answer: 'greater',
    success: 'Верно: функция с основанием от нуля до единицы убывает.',
  },
  {
    id: '11.17-g',
    exercise: '11.17',
    subpoint: 'г',
    left: String.raw`9^{-1}`,
    right: String.raw`9^{-2}`,
    answer: 'greater',
    success: 'Верно: при основании больше единицы большему показателю соответствует большее значение функции.',
  },
  {
    id: '11.18-a',
    exercise: '11.18',
    subpoint: 'а',
    left: String.raw`5^{1{,}2}`,
    right: String.raw`5^{1{,}7}`,
    answer: 'less',
    success: 'Верно: основание 5 больше единицы, а 1,2 меньше 1,7.',
  },
  {
    id: '11.18-b',
    exercise: '11.18',
    subpoint: 'б',
    left: String.raw`0{,}4^{-2}`,
    right: String.raw`0{,}4^{-3}`,
    answer: 'less',
    success: 'Верно: функция убывает, поскольку основание находится между нулём и единицей.',
  },
  {
    id: '11.18-v',
    exercise: '11.18',
    subpoint: 'в',
    left: String.raw`\left(\frac{1}{3}\right)^{-1}`,
    right: String.raw`\left(\frac{1}{3}\right)^{-2}`,
    answer: 'less',
    success: 'Верно: при основании от нуля до единицы функция убывает.',
  },
  {
    id: '11.18-g',
    exercise: '11.18',
    subpoint: 'г',
    left: String.raw`2^{\sqrt{3}}`,
    right: String.raw`2^{1{,}8}`,
    answer: 'less',
    success: 'Верно: √3 меньше 1,8, а функция с основанием 2 возрастает.',
  },
]

export const paragraph11Pages = [
  { id: 'theory', title: '📖 Теория', kind: 'theory' },
  { id: 'calculate-expression', title: '🧮 Найдите значение выражения', initiallySolved: 7, total: 7, kind: 'placeholder' },
  { id: 'identify-functions', title: '🔎 Укажите показательные функции', initiallySolved: 2, total: 2, kind: 'placeholder' },
  { id: 'find-function-value', title: '🎯 Найдите значение функции', initiallySolved: 1, total: 4, kind: 'placeholder' },
  { id: 'draw-graph', title: '📈 Схематично изобразите график', initiallySolved: 4, total: 9, kind: 'placeholder' },
  { id: 'compare-values', title: '⚖️ Сравните значения функции', total: comparisonSubpoints.length, kind: 'comparison' },
  { id: 'study-monotonicity', title: '🧭 Исследуйте монотонность', initiallySolved: 0, total: 5, kind: 'placeholder' },
  { id: 'find-extrema', title: '📏 Найдите наибольшее и наименьшее значения', initiallySolved: 0, total: 6, kind: 'placeholder' },
  { id: 'find-domain-range', title: '🗺️ Найдите область определения и значений', initiallySolved: 0, total: 7, kind: 'placeholder' },
  { id: 'solve-equation', title: '✏️ Решите уравнение', initiallySolved: 0, total: 8, kind: 'placeholder' },
  { id: 'solve-inequality', title: '⚠️ Решите неравенство', initiallySolved: 0, total: 11, kind: 'placeholder' },
] as const satisfies readonly ParagraphPageSummary[]

export type Paragraph11PageId = typeof paragraph11Pages[number]['id']

export function isParagraph11PageId(value: string | null): value is Paragraph11PageId {
  return paragraph11Pages.some((page) => page.id === value)
}

export function paragraph11SolvedSubpointCount(solvedComparisonSubpointCount: number) {
  const initiallySolvedOnListedPages = paragraph11Pages.reduce(
    (total, page) => total + ('initiallySolved' in page ? page.initiallySolved : 0),
    0,
  )
  return paragraph11InitialProgress.solvedSubpointsOutsideListedPages + initiallySolvedOnListedPages + solvedComparisonSubpointCount
}

export function isExerciseComplete(exercise: string, solvedSubpointIds: ReadonlySet<string>) {
  const exerciseSubpoints = comparisonSubpoints.filter((subpoint) => subpoint.exercise === exercise)
  return exerciseSubpoints.length > 0 && exerciseSubpoints.every((subpoint) => solvedSubpointIds.has(subpoint.id))
}
