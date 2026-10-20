import { useEffect, useRef, useState, type ReactNode } from 'react'
import { book, type BookChapter } from '../content/book'
import type { Paragraph11PageId } from '../content/practice11'
import type { summarizeParagraph11Progress } from '../content/paragraph11Progress'
import { pagesForParagraph, type BookPageTarget } from '../content/navigation'
import { availableParagraph11Exercises, paragraph11ExerciseContent } from '../content/exerciseContent'

type BookShellProps = {
  currentChapterNumber: number
  currentParagraphNumber?: number
  currentPageId?: Paragraph11PageId
  currentExerciseId?: string
  progress: ReturnType<typeof summarizeParagraph11Progress>
  previousPage?: BookPageTarget
  nextPage?: BookPageTarget
  children: ReactNode
  onOpenPage: (paragraphNumber: number, pageId: Paragraph11PageId) => void
  onOpenExercise: (id: string, pageId: Paragraph11PageId) => void
  onOpenChapter: (chapter: BookChapter) => void
}

export function BookShell({
  currentChapterNumber,
  currentParagraphNumber,
  currentPageId,
  currentExerciseId,
  progress,
  previousPage,
  nextPage,
  children,
  onOpenPage,
  onOpenExercise,
  onOpenChapter,
}: BookShellProps) {
  const [treeOpen, setTreeOpen] = useState(false)
  const contentRef = useRef<HTMLElement>(null)
  const solvedCount = progress.solvedParts
  const totalParts = progress.totalParts

  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTop = 0
  }, [currentChapterNumber, currentParagraphNumber, currentPageId])

  return (
    <main className={`book-shell${treeOpen ? ' is-tree-open' : ''}`}>
      <header className="book-shell-header">
        <h1>Interactive Books</h1>
        <div className="header-progress" aria-label="Прогресс параграфа §11">
          <div className="progress-copy">{solvedCount} из {totalParts} решено</div>
          {progress.allPartsSolved && <p role="status">Все задания §11 решены.</p>}
          <div
            className="progress-track"
            role="progressbar"
            aria-label="Выполнение практики §11"
            aria-valuemin={0}
            aria-valuemax={totalParts}
            aria-valuenow={solvedCount}
          >
            <div className="progress-fill" style={{ width: `${solvedCount / totalParts * 100}%` }} />
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
              const currentChapter = chapter.number === currentChapterNumber
              return (
                <details className="tree-group" open={currentChapter || undefined} key={chapter.number}>
                  <summary><span>Глава {chapter.number}. {chapter.title}</span></summary>
                  <div className="tree-children">
                    {chapter.paragraphs.map((paragraph) => {
                      const currentParagraph = paragraph.number === currentParagraphNumber
                      const pages = pagesForParagraph(paragraph.number)
                      return (
                        <details className="tree-group" open={currentParagraph || undefined} key={paragraph.number}>
                          <summary>
                            <span>§{paragraph.number}. {paragraph.title}</span>
                            {paragraph.number === 11 && <span className="tree-count">{solvedCount}/{totalParts}</span>}
                          </summary>
                          <div className="tree-children">
                            {pages.map((page) => {
                              const isCurrent = currentParagraph && page.id === currentPageId
                              const total = 'total' in page ? page.total : undefined
                              const solved = paragraph.number === 11
                                ? progress.groups.find((group) => group.id === page.id)?.solvedParts ?? 0
                                : 0
                              const isComplete = total !== undefined && solved === total
                              const opensPlaceholder = chapter.number !== 3
                              const accessibleName = `§${paragraph.number}. ${paragraph.title} — ${page.title}`
                              return (
                                <div key={page.id}><button
                                  className={`tree-entry${isCurrent ? ' is-current' : ''}${isComplete ? ' is-complete' : ''}`}
                                  type="button"
                                  aria-label={accessibleName}
                                  aria-current={isCurrent ? 'page' : undefined}
                                  onClick={() => opensPlaceholder ? onOpenChapter(chapter) : onOpenPage(paragraph.number, page.id)}
                                >
                                  <span>{page.title}</span>
                                  {total !== undefined && <span className="tree-count">{solved}/{total}</span>}
                                </button>
                                {paragraph.number === 11 && availableParagraph11Exercises(paragraph11ExerciseContent).filter((exercise) => exercise.practiceGroup === page.id).map((exercise) => <button
                                  type="button" key={exercise.id} className="tree-entry tree-exercise"
                                  aria-current={isCurrent && currentExerciseId === exercise.id ? 'page' : undefined}
                                  onClick={() => onOpenExercise(exercise.id, page.id)}>
                                  Упражнение {exercise.id}{progress.completedExerciseIds.includes(exercise.id) ? ' ✓' : ''}
                                </button>)}
                                </div>
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

        <section className="book-shell-content" data-testid="book-content" ref={contentRef}>
          <div className="book-shell-page">
            {children}
            {(previousPage || nextPage) && (
              <nav className="paragraph-pagination" aria-label="Переход между страницами книги">
                {previousPage ? (
                  <button type="button" onClick={() => onOpenPage(previousPage.paragraphNumber, previousPage.pageId)}>
                    <span aria-hidden="true">← </span>{previousPage.label}
                  </button>
                ) : <span />}
                {nextPage ? (
                  <button type="button" onClick={() => onOpenPage(nextPage.paragraphNumber, nextPage.pageId)}>
                    {nextPage.label}<span aria-hidden="true"> →</span>
                  </button>
                ) : <span />}
              </nav>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}
