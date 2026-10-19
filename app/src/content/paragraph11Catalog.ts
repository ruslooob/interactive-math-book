export type BookLevel = 'simple' | 'medium' | 'difficult'

export type PracticeGroupId =
  | 'calculate-expression'
  | 'identify-functions'
  | 'find-function-value'
  | 'draw-graph'
  | 'compare-values'
  | 'study-monotonicity'
  | 'find-extrema'
  | 'prove-identity'
  | 'find-domain-range'
  | 'solve-equation'
  | 'solve-inequality'
  | 'find-integer-values'

export type ExercisePartId = `11.${number}-${'a' | 'b' | 'v' | 'g'}`

export type ExercisePart = {
  readonly id: ExercisePartId
  readonly letter: 'а' | 'б' | 'в' | 'г'
}

export type BookExercise = {
  readonly id: `11.${number}`
  readonly printedPage: number
  readonly level: BookLevel
  readonly practiceGroup: PracticeGroupId
  readonly parts: readonly ExercisePart[]
}

// Source: local Mordkovich scan, printed pages 62–73 (PDF pages 63–74).
// Part IDs use Latin suffixes and remain stable when content becomes available.
const sourceRows: readonly [number, number, BookLevel, PracticeGroupId, 2 | 4][] = [
  [1, 62, 'simple', 'calculate-expression', 4],
  [2, 62, 'simple', 'calculate-expression', 4],
  [3, 62, 'simple', 'calculate-expression', 4],
  [4, 62, 'simple', 'calculate-expression', 4],
  [5, 62, 'simple', 'calculate-expression', 4],
  [6, 63, 'simple', 'calculate-expression', 4],
  [7, 63, 'simple', 'calculate-expression', 4],
  [8, 63, 'simple', 'identify-functions', 4],
  [9, 63, 'simple', 'identify-functions', 4],
  [10, 63, 'simple', 'find-function-value', 4],
  [11, 63, 'simple', 'find-function-value', 4],
  [12, 63, 'simple', 'find-function-value', 4],
  [13, 64, 'simple', 'draw-graph', 4],
  [14, 64, 'simple', 'draw-graph', 4],
  [15, 64, 'medium', 'draw-graph', 4],
  [16, 64, 'simple', 'draw-graph', 4],
  [17, 64, 'simple', 'compare-values', 4],
  [18, 64, 'simple', 'compare-values', 4],
  [19, 65, 'simple', 'compare-values', 4],
  [20, 65, 'simple', 'compare-values', 4],
  [21, 65, 'simple', 'compare-values', 4],
  [22, 65, 'simple', 'compare-values', 4],
  [23, 65, 'medium', 'compare-values', 2],
  [24, 65, 'medium', 'compare-values', 2],
  [25, 65, 'medium', 'compare-values', 2],
  [26, 66, 'simple', 'study-monotonicity', 4],
  [27, 66, 'simple', 'study-monotonicity', 4],
  [28, 66, 'medium', 'study-monotonicity', 4],
  [29, 66, 'simple', 'study-monotonicity', 4],
  [30, 66, 'simple', 'study-monotonicity', 4],
  [31, 66, 'simple', 'find-extrema', 4],
  [32, 66, 'simple', 'find-extrema', 4],
  [33, 66, 'simple', 'find-extrema', 4],
  [34, 67, 'simple', 'find-extrema', 4],
  [35, 67, 'medium', 'find-extrema', 4],
  [36, 67, 'medium', 'find-extrema', 4],
  [37, 67, 'simple', 'find-extrema', 2],
  [38, 67, 'simple', 'find-extrema', 2],
  [39, 68, 'medium', 'prove-identity', 4],
  [40, 68, 'medium', 'prove-identity', 4],
  [41, 68, 'simple', 'find-domain-range', 4],
  [42, 68, 'simple', 'find-domain-range', 4],
  [43, 68, 'simple', 'find-domain-range', 4],
  [44, 69, 'medium', 'find-domain-range', 4],
  [45, 69, 'medium', 'find-domain-range', 4],
  [46, 69, 'medium', 'find-domain-range', 4],
  [47, 69, 'medium', 'find-domain-range', 4],
  [48, 69, 'simple', 'draw-graph', 4],
  [49, 69, 'simple', 'draw-graph', 4],
  [50, 69, 'medium', 'draw-graph', 4],
  [51, 70, 'medium', 'draw-graph', 2],
  [52, 70, 'medium', 'draw-graph', 2],
  [53, 70, 'medium', 'draw-graph', 2],
  [54, 70, 'medium', 'draw-graph', 2],
  [55, 70, 'medium', 'draw-graph', 2],
  [56, 71, 'medium', 'draw-graph', 4],
  [57, 71, 'medium', 'draw-graph', 2],
  [58, 71, 'difficult', 'draw-graph', 2],
  [59, 71, 'simple', 'solve-equation', 4],
  [60, 71, 'medium', 'solve-equation', 4],
  [61, 71, 'medium', 'solve-equation', 4],
  [62, 71, 'medium', 'solve-equation', 4],
  [63, 71, 'medium', 'solve-equation', 4],
  [64, 71, 'medium', 'solve-equation', 2],
  [65, 71, 'medium', 'solve-equation', 4],
  [66, 72, 'medium', 'solve-equation', 4],
  [67, 72, 'simple', 'solve-inequality', 4],
  [68, 72, 'simple', 'solve-inequality', 4],
  [69, 72, 'medium', 'solve-inequality', 4],
  [70, 72, 'medium', 'solve-inequality', 4],
  [71, 72, 'medium', 'solve-inequality', 4],
  [72, 72, 'medium', 'solve-inequality', 4],
  [73, 73, 'medium', 'solve-inequality', 4],
  [74, 73, 'medium', 'solve-inequality', 4],
  [75, 73, 'difficult', 'solve-inequality', 4],
  [76, 73, 'difficult', 'solve-inequality', 4],
  [77, 73, 'difficult', 'solve-inequality', 4],
  [78, 73, 'difficult', 'find-integer-values', 2],
]

const partLetters = [
  ['a', 'а'], ['b', 'б'], ['v', 'в'], ['g', 'г'],
] as const

export const paragraph11Catalog: readonly BookExercise[] = sourceRows.map(
  ([number, printedPage, level, practiceGroup, partCount]) => ({
    id: `11.${number}`,
    printedPage,
    level,
    practiceGroup,
    parts: partLetters.slice(0, partCount).map(([suffix, letter]) => ({
      id: `11.${number}-${suffix}`,
      letter,
    })),
  }),
)

export const paragraph11PartIds: ReadonlySet<ExercisePartId> = new Set(paragraph11Catalog.flatMap((exercise) => exercise.parts.map((part) => part.id)))

export function isParagraph11PartId(value: unknown): value is ExercisePartId {
  return typeof value === 'string' && paragraph11PartIds.has(value as ExercisePartId)
}
