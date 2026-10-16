import { Formula } from './Formula'

const rules = [
  { source: String.raw`a^u\cdot a^v=a^{u+v}`, result: String.raw`\log_a(xy)=\log_a x+\log_a y`, label: 'произведение → сумма' },
  { source: String.raw`\frac{a^u}{a^v}=a^{u-v}`, result: String.raw`\log_a\frac{x}{y}=\log_a x-\log_a y`, label: 'частное → разность' },
  { source: String.raw`(a^u)^r=a^{ru}`, result: String.raw`\log_a(x^r)=r\log_a x`, label: 'степень → множитель' },
]

export function RuleBench({ active }: { active: boolean }) {
  return (
    <section className={`rule-bench${active ? ' is-active' : ''}`}>
      <div className="rule-bench__intro">
        <span className="eyebrow">Мост §16</span>
        <strong>Свойства логарифмов не возникают отдельно</strong>
        <p>Они переводят правила действий со степенями на язык показателей.</p>
      </div>
      <div className="rule-bench__cards">
        {rules.map((rule) => (
          <article key={rule.label}>
            <span>{rule.label}</span>
            <Formula>{rule.source}</Formula>
            <i>↓</i>
            <Formula>{rule.result}</Formula>
          </article>
        ))}
      </div>
    </section>
  )
}
