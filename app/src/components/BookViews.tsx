import { book, implementedParagraphs, type BookChapter } from '../content/book'
import { BookBreadcrumb } from './ParagraphHeader'

export function TableOfContents({ onOpenParagraph, onOpenChapter }: { onOpenParagraph: (number: number) => void; onOpenChapter: (chapter: BookChapter) => void }) {
  return (
    <main className="book-page">
      <BookBreadcrumb current="Оглавление" onOpenContents={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
      <article className="book-contents">
        <header className="contents-title">
          <span className="content-label">Книга</span>
          <h1>{book.title}</h1>
          <p>Оглавление</p>
        </header>

        <div className="chapter-list">
          {book.chapters.map((chapter) => {
            const implemented = chapter.number === 3
            return (
              <section className={implemented ? 'chapter-entry chapter-entry--active' : 'chapter-entry'} key={chapter.number}>
                <button className="chapter-title" type="button" onClick={() => implemented ? onOpenParagraph(11) : onOpenChapter(chapter)}>
                  <span>Глава {chapter.number}</span>
                  <strong>{chapter.title}</strong>
                  {!implemented && <em>Готовится</em>}
                </button>
                <ol>
                  {chapter.paragraphs.map((paragraph) => (
                    <li key={paragraph.number}>
                      <button type="button" onClick={() => implementedParagraphs.has(paragraph.number) ? onOpenParagraph(paragraph.number) : onOpenChapter(chapter)}>
                        <span>§ {paragraph.number}. {paragraph.title}</span>
                      </button>
                    </li>
                  ))}
                </ol>
              </section>
            )
          })}
        </div>
      </article>
    </main>
  )
}

export function ChapterPlaceholder({ chapter, onOpenContents }: { chapter: BookChapter; onOpenContents: () => void }) {
  return (
    <main className="book-page">
      <BookBreadcrumb current={`Глава ${chapter.number}. ${chapter.title}`} onOpenContents={onOpenContents} />
      <article className="chapter-placeholder">
        <span className="placeholder-number">{chapter.number.toString().padStart(2, '0')}</span>
        <span className="content-label">Глава пока не реализована</span>
        <h1>Глава {chapter.number}. {chapter.title}</h1>
        <p>Сейчас доступна глава 3 «Показательная и логарифмическая функции».</p>
        <button type="button" onClick={onOpenContents}>Вернуться к оглавлению</button>
      </article>
    </main>
  )
}
