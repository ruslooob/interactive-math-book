import { useEffect, useState, type ReactNode } from 'react'
import { book, type BookChapter } from '../content/book'
import {
  paragraph11Pages,
  paragraph11SolvedSubpointCount,
  paragraph11TotalSubpoints,
  type Paragraph11PageId,
} from '../content/practice11'

type BookShellProps = {
  paragraphNumber: number
  paragraphTitle: string
  currentPageId: Paragraph11PageId
  solvedComparisonSubpointCount: number
  children: ReactNode
  onOpenPage: (paragraphNumber: number, pageId: Paragraph11PageId) => void
  onOpenChapter: (chapter: BookChapter) => void
}

type TreePage = {
  id: Paragraph11PageId
  title: string
  solved: number
  total?: number
}

function pagesForParagraph(paragraphNumber: number, solvedComparisonSubpointCount: number): TreePage[] {
  if (paragraphNumber !== 11) return [{ id: 'theory' as const, title: '📖 Теория', solved: 0 }]
  return paragraph11Pages.map((page) => ({
    id: page.id,
    title: page.title,
    total: 'total' in page ? page.total : undefined,
    solved: page.id === 'compare-values' ? solvedComparisonSubpointCount : ('initiallySolved' in page ? page.initiallySolved : 0),
  }))
}

export function BookShell({
  paragraphNumber,
  paragraphTitle,
  currentPageId,
  solvedComparisonSubpointCount,
  children,
  onOpenPage,
  onOpenChapter,
}: BookShellProps) {
  const [treeOpen, setTreeOpen] = useState(false)
  const solvedCount = paragraph11SolvedSubpointCount(solvedComparisonSubpointCount)

  useEffect(() => setTreeOpen(false), [currentPageId, paragraphNumber])

  return (
    <main className={`book-shell${treeOpen ? ' is-tree-open' : ''}`}>
      <header className="book-shell-header">
        <h1>{paragraphTitle}</h1>
        <div className="header-progress" aria-label="Прогресс параграфа">
          <div className="progress-copy">{solvedCount} из {paragraph11TotalSubpoints} решено</div>
          <div
            className="progress-track"
            role="progressbar"
            aria-label="Выполнение практики"
            aria-valuemin={0}
            aria-valuemax={paragraph11TotalSubpoints}
            aria-valuenow={solvedCount}
          >
            <div className="progress-fill" style={{ width: `${solvedCount / paragraph11TotalSubpoints * 100}%` }} />
          </div>
        </div>
      </header>

      <div className="book-shell-body">
        <button
          className="menu-button"
          type="button"
          aria-label={treeOpen ? 'Закрыть дерево книги' : 'Открыть дерево книги'}
          aria-expanded={treeOpen}
          aria-controls="book-tree"
          onClick={() => setTreeOpen((open) => !open)}
        >
          <span className="menu-icon" aria-hidden="true"><i /><i /><i /></span>
        </button>

        <nav className="tree-drawer" id="book-tree" aria-label="Дерево книги">
          <div className="tree-title"><strong>{book.title}</strong></div>
          <div className="tree-root">
            {book.chapters.map((chapter) => {
              const currentChapter = chapter.paragraphs.some((paragraph) => paragraph.number === paragraphNumber)
              return (
                <details className="tree-group" open={currentChapter || undefined} key={chapter.number}>
                  <summary><span>Глава {chapter.number}. {chapter.title}</span></summary>
                  <div className="tree-children">
                    {chapter.paragraphs.map((paragraph) => {
                      const currentParagraph = paragraph.number === paragraphNumber
                      const pages = pagesForParagraph(paragraph.number, solvedComparisonSubpointCount)
                      return (
                        <details className="tree-group" open={currentParagraph || undefined} key={paragraph.number}>
                          <summary>
                            <span>§{paragraph.number}. {paragraph.title}</span>
                            {paragraph.number === 11 && <span className="tree-count">{solvedCount}/{paragraph11TotalSubpoints}</span>}
                          </summary>
                          <div className="tree-children">
                            {pages.map((page) => {
                              const isCurrent = currentParagraph && page.id === currentPageId
                              const isComplete = page.total !== undefined && page.solved === page.total
                              const opensPlaceholder = chapter.number !== 3
                              return (
                                <button
                                  className={`tree-entry${isCurrent ? ' is-current' : ''}${isComplete ? ' is-complete' : ''}`}
                                  type="button"
                                  aria-current={isCurrent ? 'page' : undefined}
                                  key={page.id}
                                  onClick={() => opensPlaceholder ? onOpenChapter(chapter) : onOpenPage(paragraph.number, page.id)}
                                >
                                  <span>{page.title}</span>
                                  {page.total !== undefined && <span className="tree-count">{page.solved}/{page.total}</span>}
                                </button>
                              )
                            })}
                          </div>
                        </details>
                      )
                    })}
                  </div>
                </details>
              )
            })}
          </div>
        </nav>

        <section className="book-shell-content" data-testid="book-content">{children}</section>
      </div>
    </main>
  )
}
