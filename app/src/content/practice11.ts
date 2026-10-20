import { paragraph11Catalog, type PracticeGroupId } from './paragraph11Catalog'

export type ParagraphPageSummary = {
  id: string
  title: string
  total?: number
  kind: 'theory' | 'placeholder'
}

const practiceGroups = [
  { id: 'calculate-expression', title: '🧮 Найдите значение выражения' },
  { id: 'identify-functions', title: '🔎 Укажите показательные функции' },
  { id: 'find-function-value', title: '🎯 Найдите значение функции' },
  { id: 'draw-graph', title: '📈 Схематично изобразите график' },
  { id: 'compare-values', title: '⚖️ Сравните значения функции' },
  { id: 'study-monotonicity', title: '🧭 Исследуйте монотонность' },
  { id: 'find-extrema', title: '📏 Найдите наибольшее и наименьшее значения' },
  { id: 'prove-identity', title: '📝 Докажите тождество' },
  { id: 'find-domain-range', title: '🗺️ Найдите область определения и значений' },
  { id: 'solve-equation', title: '✏️ Решите уравнение' },
  { id: 'solve-inequality', title: '⚠️ Решите неравенство' },
  { id: 'find-integer-values', title: '🔢 Найдите целые значения' },
] as const satisfies readonly { id: PracticeGroupId; title: string }[]

export const paragraph11Pages = [
  { id: 'theory', title: '📖 Теория', kind: 'theory' },
  ...practiceGroups.map((group) => ({
    ...group,
    total: paragraph11Catalog.filter((exercise) => exercise.practiceGroup === group.id)
      .reduce((total, exercise) => total + exercise.parts.length, 0),
    kind: 'placeholder' as const,
  })),
] as const satisfies readonly ParagraphPageSummary[]

export type Paragraph11PageId = typeof paragraph11Pages[number]['id']

export function isParagraph11PageId(value: string | null): value is Paragraph11PageId {
  return paragraph11Pages.some((page) => page.id === value)
}
