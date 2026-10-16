export type VariantId = 'A' | 'B' | 'C'

export const variants: VariantId[] = ['A', 'B', 'C']

const variantNames: Record<VariantId, string> = {
  A: 'Разворот книги',
  B: 'Основная анимация',
  C: 'Последовательный параграф',
}

export function PrototypeSwitcher({ variant, onChange }: { variant: VariantId; onChange: (variant: VariantId) => void }) {
  return (
    <aside className="prototype-switcher" aria-label="Варианты прототипа">
      <span>Вариант прототипа</span>
      <div>
        {variants.map((item) => (
          <button className={variant === item ? 'is-active' : ''} key={item} type="button" onClick={() => onChange(item)}>
            <b>{item}</b>
            <span>{variantNames[item]}</span>
          </button>
        ))}
      </div>
      <small>Переключение: ← →</small>
    </aside>
  )
}
