import type { BookChapter } from '../content/book'

export function ChapterPlaceholder({ chapter }: { chapter: BookChapter }) {
  return (
    <div className="book-page book-page--embedded">
      <article className="chapter-placeholder">
        <span className="placeholder-number">{chapter.number.toString().padStart(2, '0')}</span>
        <span className="content-label">Глава пока не реализована</span>
        <h1>Глава {chapter.number}. {chapter.title}</h1>
        <p>Сейчас доступна глава 3 «Показательная и логарифмическая функции».</p>
      </article>
    </div>
  )
}
