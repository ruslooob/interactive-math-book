import { lenses, sections, type SectionId } from '../content/chapter'

type ChapterNavProps = {
  activeId: SectionId
  onSelect: (id: SectionId) => void
  direction?: 'vertical' | 'horizontal'
}

export function ChapterNav({ activeId, onSelect, direction = 'vertical' }: ChapterNavProps) {
  return (
    <nav className={`chapter-nav chapter-nav--${direction}`} aria-label="Параграфы главы 3">
      {lenses.map((lens) => (
        <div className="chapter-nav__group" key={lens.id}>
          <span className="chapter-nav__label">{lens.label}</span>
          <div className="chapter-nav__items">
            {sections.filter((section) => lens.sections.includes(section.id)).map((section) => (
              <button
                className={section.id === activeId ? 'is-active' : ''}
                key={section.id}
                onClick={() => onSelect(section.id)}
                type="button"
              >
                <span>§{section.id}</span>
                <strong>{section.shortTitle}</strong>
              </button>
            ))}
          </div>
        </div>
      ))}
    </nav>
  )
}
