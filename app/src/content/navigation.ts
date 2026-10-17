import { book } from './book'
import { paragraph11Pages, type Paragraph11PageId, type ParagraphPageSummary } from './practice11'

type BookPageSummary = Omit<ParagraphPageSummary, 'id'> & { id: Paragraph11PageId }

export type BookPageTarget = {
  paragraphNumber: number
  pageId: Paragraph11PageId
  label: string
}

const theoryPage = { id: 'theory', title: '📖 Теория', kind: 'theory' } as const satisfies BookPageSummary

export function pagesForParagraph(paragraphNumber: number): readonly BookPageSummary[] {
  return paragraphNumber === 11 ? paragraph11Pages : [theoryPage]
}

export const chapter3PageSequence: BookPageTarget[] = book.chapters
  .find((chapter) => chapter.number === 3)!
  .paragraphs.flatMap((paragraph) => pagesForParagraph(paragraph.number).map((page) => ({
    paragraphNumber: paragraph.number,
    pageId: page.id,
    label: page.id === 'theory' ? `§${paragraph.number}. ${paragraph.title}` : page.title,
  })))
