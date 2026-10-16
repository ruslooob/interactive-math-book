import { paragraph11 } from '../content/paragraph11'
import { Formula } from './Formula'

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
      <div className="definition-summary">
        <span className="content-label">Определение</span>
        <p>{paragraph11.introduction}</p>
        <p className="formula-sentence">
          <span>На языке формул это записывается так:</span>
          <Formula>{'y=a^x,\\qquad \\text{где }a>0,\\ a\\ne1'}</Formula>
        </p>
      </div>
    </section>
  )
}
