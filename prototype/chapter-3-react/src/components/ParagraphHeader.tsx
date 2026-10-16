import { paragraph11 } from '../content/paragraph11'

export function ParagraphHeader() {
  return (
    <header className="paragraph-header">
      <nav aria-label="Положение в книге">
        <span>{paragraph11.book}</span>
        <i aria-hidden="true">/</i>
        <span>{paragraph11.chapter}</span>
        <i aria-hidden="true">/</i>
        <strong>{paragraph11.number}</strong>
      </nav>
    </header>
  )
}

export function ParagraphIntroduction({ compact = false }: { compact?: boolean }) {
  return (
    <section className={compact ? 'paragraph-intro paragraph-intro--compact' : 'paragraph-intro'}>
      <span className="section-mark">{paragraph11.number}</span>
      <h1>{paragraph11.title}</h1>
      <div className="paragraph-intro__text">
        {paragraph11.introduction.map((sentence) => <p key={sentence}>{sentence}</p>)}
      </div>
    </section>
  )
}
