import type { ReactNode } from 'react'
import { intro, sections, type SectionId } from '../content/chapter'
import { baseLabel, isValidBase, monotonicity } from '../lib/math'
import { ChapterNav } from './ChapterNav'
import { ControlDeck } from './ControlDeck'
import { Formula } from './Formula'
import { GraphScene } from './GraphScene'
import { InsightPanel } from './InsightPanel'
import { RuleBench } from './RuleBench'
import { UnderstandingCheck } from './UnderstandingCheck'

export type SceneState = {
  sectionId: SectionId
  base: number
  probeX: number
  target: number
  showExp: boolean
  showLog: boolean
  showMirror: boolean
}

export type SceneActions = {
  setSectionId: (value: SectionId) => void
  setBase: (value: number) => void
  setProbeX: (value: number) => void
  setTarget: (value: number) => void
  setShowExp: (value: boolean) => void
  setShowLog: (value: boolean) => void
  setShowMirror: (value: boolean) => void
}

type VariantProps = {
  state: SceneState
  actions: SceneActions
}

function PageHeader({ variant, children }: { variant: string; children?: ReactNode }) {
  return (
    <header className="page-header">
      <div className="brand"><i /> Лаборатория функций <span>03</span></div>
      <div className="variant-label">Композиция {variant}</div>
      {children}
    </header>
  )
}

function IntroBlock({ compact = false }: { compact?: boolean }) {
  return (
    <section className={`intro-block${compact ? ' intro-block--compact' : ''}`}>
      <span className="eyebrow">Глава 3 · §§11–19</span>
      <h1>Экспонента и логарифм:<br />одна система</h1>
      <p>{intro}</p>
      <div className="intro-thesis">
        <span>Главная связь</span>
        <strong>вход ⇄ результат</strong>
        <small>(x; aˣ) ⇄ (aˣ; x)</small>
      </div>
    </section>
  )
}

function Controls({ state, actions, compact = false }: VariantProps & { compact?: boolean }) {
  return <ControlDeck compact={compact} base={state.base} probeX={state.probeX} target={state.target} showExp={state.showExp} showLog={state.showLog} showMirror={state.showMirror} onBase={actions.setBase} onProbeX={actions.setProbeX} onTarget={actions.setTarget} onShowExp={actions.setShowExp} onShowLog={actions.setShowLog} onShowMirror={actions.setShowMirror} />
}

function Scene({ state, compact = false }: { state: SceneState; compact?: boolean }) {
  return <GraphScene compact={compact} base={state.base} probeX={state.probeX} target={state.target} sectionId={state.sectionId} showExp={state.showExp} showLog={state.showLog} showMirror={state.showMirror} />
}

export function VariantA({ state, actions }: VariantProps) {
  return (
    <main className="prototype-page variant-a">
      <PageHeader variant="A · карта и фокус" />
      <IntroBlock compact />
      <div className="variant-a__workspace">
        <ChapterNav activeId={state.sectionId} onSelect={actions.setSectionId} />
        <div className="variant-a__center">
          <Scene state={state} />
          <RuleBench active={state.sectionId === 16} />
          <Controls state={state} actions={actions} compact />
        </div>
        <div className="variant-a__right">
          <InsightPanel sectionId={state.sectionId} />
          <UnderstandingCheck base={state.base} />
        </div>
      </div>
    </main>
  )
}

export function VariantB({ state, actions }: VariantProps) {
  return (
    <main className="prototype-page variant-b">
      <PageHeader variant="B · атлас">
        <span className="header-hint">← → переключают композиции</span>
      </PageHeader>
      <div className="variant-b__intro-row">
        <IntroBlock compact />
        <div className="chapter-summary">
          <span>5 смысловых режимов</span>
          <strong>9 параграфов</strong>
          <p>Один графический язык связывает определения, решения и скорость изменения.</p>
        </div>
      </div>
      <ChapterNav activeId={state.sectionId} onSelect={actions.setSectionId} direction="horizontal" />
      <div className="variant-b__stage">
        <Scene state={state} />
        <InsightPanel sectionId={state.sectionId} />
      </div>
      <div className="variant-b__bench">
        <Controls state={state} actions={actions} />
        <RuleBench active={state.sectionId === 16} />
        <UnderstandingCheck base={state.base} />
      </div>
    </main>
  )
}

function FamilyCard({ kind, base }: { kind: 'exp' | 'log'; base: number }) {
  const valid = isValidBase(base)
  const isExp = kind === 'exp'
  return (
    <article className={`family-card family-card--${kind}`}>
      <div className="family-card__top">
        <span>{isExp ? 'Прямое действие' : 'Обратное действие'}</span>
        <i>{isExp ? 'EXP' : 'LOG'}</i>
      </div>
      <Formula display>{isExp ? 'y=a^x' : String.raw`y=\log_a x`}</Formula>
      <dl>
        <div><dt>Вход</dt><dd>{isExp ? 'любое x' : 'только x > 0'}</dd></div>
        <div><dt>Выход</dt><dd>{isExp ? 'только y > 0' : 'любое y'}</dd></div>
        <div><dt>Ход</dt><dd>{valid ? monotonicity(base) : 'нет обратимости'}</dd></div>
        <div><dt>Якорь</dt><dd>{isExp ? '(0; 1)' : '(1; 0)'}</dd></div>
      </dl>
    </article>
  )
}

export function VariantC({ state, actions }: VariantProps) {
  return (
    <main className="prototype-page variant-c">
      <PageHeader variant="C · парная лаборатория" />
      <div className="variant-c__hero">
        <IntroBlock />
        <div className="base-display">
          <span>Общее основание</span>
          <strong>a = {baseLabel(state.base)}</strong>
          <small>{isValidBase(state.base) ? `обе функции ${monotonicity(state.base)}` : 'эта остановка объясняет запрет a = 1'}</small>
        </div>
      </div>
      <div className="variant-c__families">
        <FamilyCard kind="exp" base={state.base} />
        <div className="inverse-badge"><span>отражение</span><strong>y = x</strong><i>⇄</i></div>
        <FamilyCard kind="log" base={state.base} />
      </div>
      <div className="variant-c__workspace">
        <div className="variant-c__timeline">
          <span className="eyebrow">Маршрут главы</span>
          {sections.map((section) => (
            <button className={state.sectionId === section.id ? 'is-active' : ''} type="button" key={section.id} onClick={() => actions.setSectionId(section.id)}>
              <span>§{section.id}</span><strong>{section.shortTitle}</strong>
            </button>
          ))}
        </div>
        <div className="variant-c__model">
          <Scene state={state} compact />
          <RuleBench active={state.sectionId === 16} />
        </div>
        <div className="variant-c__tools">
          <InsightPanel sectionId={state.sectionId} />
          <Controls state={state} actions={actions} compact />
        </div>
      </div>
    </main>
  )
}
