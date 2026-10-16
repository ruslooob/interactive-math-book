import { getSection, type SectionId } from '../content/chapter'
import { Formula } from './Formula'

type InsightPanelProps = {
  sectionId: SectionId
}

export function InsightPanel({ sectionId }: InsightPanelProps) {
  const section = getSection(sectionId)

  return (
    <aside className="insight-panel">
      <div className="insight-panel__number">§{section.id}</div>
      <span className="eyebrow">{section.title}</span>
      <h2>{section.question}</h2>
      <p className="insight-panel__idea">{section.idea}</p>
      <div className="formula-card">
        <Formula display>{section.formula}</Formula>
      </div>
      <div className="experiment-note">
        <span>Попробуй</span>
        <p>{section.action}</p>
      </div>
      <div className="observation-note">
        <span>Заметь</span>
        <p>{section.lookFor}</p>
      </div>
    </aside>
  )
}
