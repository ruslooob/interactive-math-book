import { paragraph11 } from '../content/paragraph11'

export function ParagraphHeader() {
  return (
    <header className="paragraph-header">
      <nav aria-label="Положение в книге">
        <span>{paragraph11.book}</span>
        <i aria-hidden="true">/</i>
        <span>{paragraph11.chapter}</span>
        <i aria-hidden="true">/</i>
        <strong>{paragraph11.number}: {paragraph11.title}</strong>
      </nav>
    </header>
  )
}

export function ParagraphIntroduction() {
  return (
    <section className="paragraph-intro">
      <h1><span>{paragraph11.number}:</span> {paragraph11.title}</h1>
      <p>{paragraph11.introduction}</p>
    </section>
  )
}
