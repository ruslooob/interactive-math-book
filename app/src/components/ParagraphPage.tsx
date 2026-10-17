import type { ParagraphData } from '../content/chapter3'
import type { AnimationActions, AnimationState } from './AnimationParameters'
import { InteractiveStage } from './InteractiveStage'
import { ExampleBlock, MethodBlock, NotesBlock, ParagraphConclusion, PropertiesBlock } from './ParagraphContent'
import { ParagraphIntroduction } from './ParagraphHeader'
import { UnderstandingCheck } from './UnderstandingCheck'

export function ParagraphPage({
  paragraph,
  state,
  actions,
}: {
  paragraph: ParagraphData
  state: AnimationState
  actions: AnimationActions
}) {
  const developsSkill = paragraph.goal.type === 'develop-skill'

  const examples = <ExampleBlock key={paragraph.number} example={paragraph.example} variants={paragraph.exampleVariants} />
  const method = paragraph.method && <MethodBlock method={paragraph.method} />
  const properties = paragraph.properties.length > 0 && (
    <PropertiesBlock title={paragraph.propertiesTitle} properties={paragraph.properties} label={developsSkill ? 'Теория' : undefined} />
  )
  const interactives = paragraph.interactives.map((interactive) => (
    <section className="paragraph-interactive" key={interactive.kind}>
      <div className="sequence-divider"><span>{interactive.label ?? (interactive.type === 'trainer' ? 'Тренажёры' : 'Анимация с параметрами')}</span></div>
      <InteractiveStage kind={interactive.kind} state={state} actions={actions} />
    </section>
  ))

  return (
    <div className="book-page book-page--embedded">
      <article className="sequential-paragraph">
        <ParagraphIntroduction paragraph={paragraph} />
        {developsSkill ? (
          <>
            {properties}
            {method}
            {examples}
            {interactives}
            {paragraph.notes.length > 0 && (
              <>
                <div className="sequence-divider"><span>Дополнительно</span></div>
                <NotesBlock notes={paragraph.notes} />
              </>
            )}
          </>
        ) : (
          <>
            {examples}
            {method}
            {interactives}
            {(paragraph.properties.length > 0 || paragraph.notes.length > 0) && (
              <>
                <div className="sequence-divider"><span>Вывод</span></div>
                <ParagraphConclusion paragraph={paragraph} />
              </>
            )}
          </>
        )}
        <UnderstandingCheck questions={paragraph.questions} resetKey={paragraph.number} />
      </article>
    </div>
  )
}
