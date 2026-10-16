import type { AnimationActions, AnimationState } from './AnimationParameters'
import { AnimationUnit } from './AnimationUnit'
import { DefinitionBlock, ExampleBlock, NotesBlock, PropertiesBlock } from './ParagraphContent'
import { ParagraphHeader, ParagraphIntroduction } from './ParagraphHeader'
import { UnderstandingCheck } from './UnderstandingCheck'

export function ParagraphPrototype({ state, actions }: { state: AnimationState; actions: AnimationActions }) {
  return (
    <main className="prototype-page">
      <ParagraphHeader />
      <article className="sequential-paragraph">
        <ParagraphIntroduction />
        <DefinitionBlock />

        <div className="sequence-divider"><span>Исследование</span></div>
        <AnimationUnit state={state} actions={actions} />

        <div className="sequence-divider"><span>Вывод</span></div>
        <PropertiesBlock />
        <NotesBlock />

        <div className="sequence-divider"><span>Пример</span></div>
        <ExampleBlock />
        <UnderstandingCheck base={state.base} />
      </article>
    </main>
  )
}
