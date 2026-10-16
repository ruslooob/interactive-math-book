import type { AnimationActions, AnimationState } from './AnimationParameters'
import { AnimationUnit } from './AnimationUnit'
import { DefinitionBlock, ExampleBlock, NotesBlock, PropertiesBlock } from './ParagraphContent'
import { ParagraphHeader, ParagraphIntroduction } from './ParagraphHeader'
import { UnderstandingCheck } from './UnderstandingCheck'

type VariantProps = {
  state: AnimationState
  actions: AnimationActions
}

export function VariantA({ state, actions }: VariantProps) {
  return (
    <main className="prototype-page variant-a">
      <ParagraphHeader />
      <div className="book-spread">
        <div className="book-spread__reading">
          <ParagraphIntroduction />
          <DefinitionBlock />
          <ExampleBlock />
          <NotesBlock />
        </div>
        <div className="book-spread__work">
          <AnimationUnit state={state} actions={actions} />
          <PropertiesBlock />
          <UnderstandingCheck base={state.base} />
        </div>
      </div>
    </main>
  )
}

export function VariantB({ state, actions }: VariantProps) {
  return (
    <main className="prototype-page variant-b">
      <ParagraphHeader />
      <ParagraphIntroduction compact />
      <AnimationUnit state={state} actions={actions} />
      <div className="discovery-result">
        <DefinitionBlock />
        <PropertiesBlock />
      </div>
      <div className="supporting-row">
        <ExampleBlock />
        <NotesBlock />
      </div>
      <UnderstandingCheck base={state.base} />
    </main>
  )
}

export function VariantC({ state, actions }: VariantProps) {
  return (
    <main className="prototype-page variant-c">
      <ParagraphHeader />
      <article className="sequential-paragraph">
        <ParagraphIntroduction />
        <div className="sequential-paragraph__foundation">
          <DefinitionBlock />
          <ExampleBlock />
        </div>
        <div className="sequence-divider"><span>Исследование</span></div>
        <AnimationUnit state={state} actions={actions} />
        <div className="sequence-divider"><span>Вывод</span></div>
        <PropertiesBlock />
        <NotesBlock />
        <UnderstandingCheck base={state.base} />
      </article>
    </main>
  )
}
