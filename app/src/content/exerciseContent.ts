import { paragraph11Catalog, type BookExercise, type ExercisePartId } from './paragraph11Catalog'

export type AnswerCheckResult =
  | { readonly correct: true; readonly feedback: string }
  | { readonly correct: false; readonly feedback: string }

// Mathematical values remain strings so checks can handle exact fractions,
// radicals, and infinities without converting them to floating point values.
export type IntervalEndpoint = { readonly value: string; readonly included: boolean }
export type AnswerInterval = { readonly lower: IntervalEndpoint; readonly upper: IntervalEndpoint }

export type ExerciseAnswers = {
  'calculated-values': { readonly values: readonly string[] }
  choices: { readonly selectedIds: readonly string[] }
  comparison: 'less' | 'equal' | 'greater'
  'ordered-steps': { readonly stepIds: readonly string[] }
  intervals: { readonly intervals: readonly AnswerInterval[] }
  graph: {
    readonly curves: readonly {
      readonly id: string
      readonly points: readonly { readonly x: string; readonly y: string }[]
      readonly transformations: readonly {
        readonly kind: 'translate-x' | 'translate-y' | 'scale-x' | 'scale-y' | 'absolute-x' | 'absolute-y'
        readonly value: string
      }[]
      readonly domain: readonly AnswerInterval[]
      readonly range: readonly AnswerInterval[]
      readonly asymptotes: readonly { readonly axis: 'x' | 'y'; readonly value: string }[]
    }[]
  }
}

export type AnswerKind = keyof ExerciseAnswers
export type PromptBlock = { readonly kind: 'text' | 'formula'; readonly value: string }

export type ExercisePartContent<K extends AnswerKind> = {
  readonly id: ExercisePartId
  readonly kind: K
  readonly prompt: readonly PromptBlock[]
  readonly checkAnswer: (answer: ExerciseAnswers[K]) => AnswerCheckResult
}

export type AnyExercisePartContent = {
  [K in AnswerKind]: ExercisePartContent<K>
}[AnswerKind]

export type ExerciseContent = {
  readonly exerciseId: BookExercise['id']
  // Set ready only when the exercise ticket's content and checks are complete.
  readonly status: 'draft' | 'ready'
  readonly parts: readonly AnyExercisePartContent[]
}

export function availableParagraph11Exercises(definitions: readonly ExerciseContent[]) {
  return paragraph11Catalog.flatMap((exercise) => {
    const candidates = definitions.filter((definition) => definition.exerciseId === exercise.id)
    if (candidates.length !== 1) return []
    const content = candidates[0]
    const partIds = new Set(content.parts.map((part) => part.id))
    const complete = content.status === 'ready'
      && content.parts.length === exercise.parts.length
      && exercise.parts.every((part) => partIds.has(part.id))
      && content.parts.every((part) => part.prompt.length > 0
        && part.prompt.every((block) => block.value.trim().length > 0)
        && typeof part.checkAnswer === 'function')
    if (!complete) return []
    const orderedParts = exercise.parts.map((part) => content.parts.find((candidate) => candidate.id === part.id)!)
    return [{ ...exercise, content: { ...content, parts: orderedParts } }]
  })
}

// Exercise tickets add their complete content here. Provisional tasks are excluded.
export const paragraph11ExerciseContent: readonly ExerciseContent[] = []
