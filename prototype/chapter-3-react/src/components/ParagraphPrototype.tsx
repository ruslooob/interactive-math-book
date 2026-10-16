import type { ParagraphData } from '../content/chapter3'
import type { AnimationActions, AnimationState } from './AnimationParameters'
import { AnimationStage } from './AnimationStage'
import { ExampleBlock, ParagraphConclusion } from './ParagraphContent'
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
        <ExampleBlock example={paragraph.example} />

        <div className="sequence-divider"><span>Анимация</span></div>
        <AnimationStage kind={paragraph.animation} state={state} actions={actions} />

        <div className="sequence-divider"><span>Вывод</span></div>
        <ParagraphConclusion paragraph={paragraph} />
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
