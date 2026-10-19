import { isParagraph11PartId, paragraph11Catalog, paragraph11PartIds, type ExercisePartId } from './paragraph11Catalog'
import type { AnswerCheckResult, AnswerKind, ExerciseAnswers, ExercisePartContent } from './exerciseContent'

// v1 stored results for provisional tasks whose book numbers were incorrect.
// Do not transfer those results to the verified exercise catalog.
export const paragraph11ProgressStorageKey = 'interactive-math-book:paragraph-11-progress:v2'

type ProgressStorage = Pick<Storage, 'getItem' | 'setItem'>

export function submitParagraph11Answer<K extends AnswerKind>(
  part: ExercisePartContent<K>,
  answer: ExerciseAnswers[K],
  solvedIds: ReadonlySet<ExercisePartId>,
) {
  const result = part.checkAnswer(answer)
  return { result, solvedIds: recordParagraph11Result(solvedIds, part.id, result) }
}

export function recordParagraph11Result(
  solvedIds: ReadonlySet<ExercisePartId>,
  partId: string,
  result: AnswerCheckResult,
): ReadonlySet<ExercisePartId> {
  if (!result.correct || !isParagraph11PartId(partId) || solvedIds.has(partId)) return solvedIds
  return new Set([...solvedIds, partId])
}

export function restoreParagraph11Progress(serialized: string | null): ReadonlySet<ExercisePartId> {
  try {
    const saved: unknown = JSON.parse(serialized ?? '[]')
    return new Set(Array.isArray(saved) ? saved.filter(isParagraph11PartId) : [])
  } catch {
    return new Set()
  }
}

export function loadParagraph11Progress(storage?: ProgressStorage): ReadonlySet<ExercisePartId> {
  try {
    return restoreParagraph11Progress((storage ?? window.localStorage).getItem(paragraph11ProgressStorageKey))
  } catch {
    return new Set()
  }
}

export function saveParagraph11Progress(solvedIds: ReadonlySet<string>, storage?: ProgressStorage): void {
  try {
    (storage ?? window.localStorage).setItem(paragraph11ProgressStorageKey, JSON.stringify([...solvedIds].filter(isParagraph11PartId)))
  } catch {
    // Storage failure must not interrupt the learner's current attempt.
  }
}

export function summarizeParagraph11Progress(solvedIds: ReadonlySet<string>) {
  const validSolvedIds = new Set([...solvedIds].filter(isParagraph11PartId))
  const groupIds = [...new Set(paragraph11Catalog.map((exercise) => exercise.practiceGroup))]
  return {
    solvedParts: validSolvedIds.size,
    totalParts: paragraph11PartIds.size,
    allPartsSolved: validSolvedIds.size === paragraph11PartIds.size,
    completedExerciseIds: paragraph11Catalog
      .filter((exercise) => exercise.parts.every((part) => validSolvedIds.has(part.id)))
      .map((exercise) => exercise.id),
    groups: groupIds.map((id) => {
      const parts = paragraph11Catalog.filter((exercise) => exercise.practiceGroup === id).flatMap((exercise) => exercise.parts)
      return { id, totalParts: parts.length, solvedParts: parts.filter((part) => validSolvedIds.has(part.id)).length }
    }),
  }
}
