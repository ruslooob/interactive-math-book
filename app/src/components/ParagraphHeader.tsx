import type { ParagraphData } from '../content/chapter3'
import { book } from '../content/book'
import { Formula } from './Formula'

export function BookBreadcrumb({ current, onOpenContents }: { current: string; onOpenContents: () => void }) {
  return (
    <header className="paragraph-header">
      <nav aria-label="Положение в книге">
        <button type="button" onClick={onOpenContents}>{book.title}</button>
        <i aria-hidden="true">/</i>
        <strong>{current}</strong>
      </nav>
    </header>
  )
}

export function ParagraphIntroduction({ paragraph, showTitle = true }: { paragraph: ParagraphData; showTitle?: boolean }) {
  return (
    <section className="paragraph-intro">
      {showTitle && <h1><span>§{paragraph.number}.</span> {paragraph.title}</h1>}
      <div className={`paragraph-goal paragraph-goal--${paragraph.goal.type}`}>
        <span className="content-label">Цель параграфа</span>
        <p>{paragraph.goal.text}</p>
      </div>
      <div className="definition-summary">
        <span className="content-label">Определение</span>
        <p>{paragraph.introduction}</p>
        <p className="formula-sentence">
          <span>{paragraph.formulaLead}</span>
          <Formula>{paragraph.formula}</Formula>
          {paragraph.conditions && (
            <span className="definition-conditions">
              где <Formula>{paragraph.conditions}</Formula>
            </span>
          )}
        </p>
      </div>
    </section>
  )
}
