import { book } from './book'
import { availableParagraph11Exercises, paragraph11ExerciseContent } from './exerciseContent'
import { paragraph11Pages, type Paragraph11PageId, type ParagraphPageSummary } from './practice11'

type BookPageSummary = Omit<ParagraphPageSummary, 'id'> & { id: Paragraph11PageId }

export type BookPageTarget = {
  paragraphNumber: number
  pageId: Paragraph11PageId
  exerciseId?: string
  label: string
}

const theoryPage = { id: 'theory', title: '📖 Теория', kind: 'theory' } as const satisfies BookPageSummary

export function pagesForParagraph(paragraphNumber: number): readonly BookPageSummary[] {
  return paragraphNumber === 11 ? paragraph11Pages : [theoryPage]
}

const exercises = availableParagraph11Exercises(paragraph11ExerciseContent)

export const chapter3PageSequence: BookPageTarget[] = book.chapters
  .find((chapter) => chapter.number === 3)!
  .paragraphs.flatMap((paragraph): BookPageTarget[] => [
    { paragraphNumber: paragraph.number, pageId: 'theory', label: `§${paragraph.number}. ${paragraph.title}` },
    ...(paragraph.number === 11 ? exercises.map((exercise) => ({
      paragraphNumber: 11,
      pageId: exercise.practiceGroup,
      exerciseId: exercise.id,
      label: `Упражнение ${exercise.id}`,
    })) : []),
  ])

export function adjacentBookPages(target: Omit<BookPageTarget, 'label'>) {
  const groupPages = chapter3PageSequence.filter((page) => page.paragraphNumber === target.paragraphNumber && page.pageId === target.pageId)
  const current = groupPages.find((page) => page.exerciseId === target.exerciseId) ?? groupPages[0]
  if (current) {
    const index = chapter3PageSequence.indexOf(current)
    return { previous: chapter3PageSequence[index - 1], next: chapter3PageSequence[index + 1] }
  }
  // An unfinished group can open a placeholder, but never enters the practice route.
  const groupOrder = pagesForParagraph(target.paragraphNumber).map((page) => page.id)
  const nextIndex = chapter3PageSequence.findIndex((page) => page.paragraphNumber > target.paragraphNumber
    || (page.paragraphNumber === target.paragraphNumber && groupOrder.indexOf(page.pageId) > groupOrder.indexOf(target.pageId)))
  return {
    previous: chapter3PageSequence[nextIndex < 0 ? chapter3PageSequence.length - 1 : nextIndex - 1],
    next: nextIndex < 0 ? undefined : chapter3PageSequence[nextIndex],
  }
}
