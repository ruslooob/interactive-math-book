import type { ParagraphData } from '../content/chapter3'
import type { AnimationActions, AnimationState } from './AnimationParameters'
import { InteractiveStage } from './InteractiveStage'
import { ExampleBlock, MethodBlock, ParagraphConclusion } from './ParagraphContent'
import { BookBreadcrumb, ParagraphIntroduction } from './ParagraphHeader'
import { UnderstandingCheck } from './UnderstandingCheck'

export function ParagraphPrototype({
  paragraph,
  state,
  actions,
  onOpenContents,
  onOpenParagraph,
}: {
  paragraph: ParagraphData
  state: AnimationState
  actions: AnimationActions
  onOpenContents: () => void
  onOpenParagraph: (number: number) => void
}) {
  const previous = paragraph.number > 11 ? paragraph.number - 1 : null
  const next = paragraph.number < 19 ? paragraph.number + 1 : null

  return (
    <main className="prototype-page">
      <BookBreadcrumb current={`§ ${paragraph.number}. ${paragraph.title}`} onOpenContents={onOpenContents} />
      <article className="sequential-paragraph">
        <ParagraphIntroduction paragraph={paragraph} />
        <ExampleBlock example={paragraph.example} variants={paragraph.exampleVariants} collectionTitle={paragraph.examplesTitle} />
        {paragraph.method && <MethodBlock method={paragraph.method} />}

        {paragraph.interactives.map((interactive) => (
          <section className="paragraph-interactive" key={interactive.kind}>
            <div className="sequence-divider"><span>{interactive.label ?? (interactive.type === 'trainer' ? 'Тренажёры' : 'Анимация с параметрами')}</span></div>
            <InteractiveStage kind={interactive.kind} state={state} actions={actions} />
          </section>
        ))}

        {(paragraph.properties.length > 0 || paragraph.notes.length > 0) && (
          <>
            <div className="sequence-divider"><span>Вывод</span></div>
            <ParagraphConclusion paragraph={paragraph} />
          </>
        )}
        <UnderstandingCheck questions={paragraph.questions} resetKey={paragraph.number} />

        <nav className="paragraph-pagination" aria-label="Переход между параграфами">
          {previous ? <button type="button" onClick={() => onOpenParagraph(previous)}>← § {previous}</button> : <span />}
          <button type="button" onClick={onOpenContents}>Оглавление</button>
          {next ? <button type="button" onClick={() => onOpenParagraph(next)}>§ {next} →</button> : <span />}
        </nav>
      </article>
    </main>
  )
}
