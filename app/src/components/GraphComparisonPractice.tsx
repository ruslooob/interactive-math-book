import { useRef, useState, type FormEvent } from 'react'
import { availableParagraph11Exercises, paragraph11ExerciseContent, type AnswerCheckResult, type ExerciseAnswers, type ExercisePartContent } from '../content/exerciseContent'
import { type GraphPart, type OrderingPart, readCoordinate } from '../content/graphComparison11'
import type { ExercisePartId, PracticeGroupId } from '../content/paragraph11Catalog'
import { Formula } from './Formula'

export const graphComparisonAvailable = availableParagraph11Exercises(paragraph11ExerciseContent)

type Props = {
  group: PracticeGroupId
  exerciseId?: string
  solvedIds: ReadonlySet<ExercisePartId>
  onResult: (id: ExercisePartId, result: AnswerCheckResult) => void
}

export function GraphComparisonPractice({ group, exerciseId, solvedIds, onResult }: Props) {
  const exercises = graphComparisonAvailable.filter((exercise) => exercise.practiceGroup === group)
  const exercise = exercises.find((item) => item.id === exerciseId) ?? exercises[0]
  const [partIndex, setPartIndex] = useState(0)
  if (!exercise) return null
  const part = exercise.content.parts[Math.min(partIndex, exercise.parts.length - 1)]
  return <section className="task-card exercise-practice graph-comparison-practice" aria-label={`Упражнение ${exercise.id}`}>
    <header className="task-card__top">
      <div className="task-heading-row">
        <h3>Упражнение {exercise.id}</h3>
        <span className="exercise-level">{exercise.level === 'simple' ? 'Простой' : exercise.level === 'medium' ? 'Средний' : 'Сложный'}</span>
      </div>
    {exercise.parts.length > 1 && <nav className="exercise-parts" aria-label="Части упражнения">
      {exercise.parts.map((item, index) => <button type="button" key={item.id}
        className={solvedIds.has(item.id) ? 'is-solved' : undefined}
        aria-current={part.id === item.id ? 'step' : undefined}
        aria-label={`Часть ${item.letter}${solvedIds.has(item.id) ? ' — решено' : ''}`}
        onClick={() => setPartIndex(index)}>{item.letter}</button>)}
    </nav>}
    </header>
    <div className="task-card__body">
    {part.kind === 'graph' && <GraphAnswer key={part.id} part={part as GraphPart} onResult={(result) => onResult(part.id, result)} />}
    {part.kind === 'comparison' && <ComparisonAnswer key={part.id} part={part} onResult={(result) => onResult(part.id, result)} />}
    {part.kind === 'ordering' && <OrderingAnswer key={part.id} part={part as OrderingPart} onResult={(result) => onResult(part.id, result)} />}
    </div>
  </section>
}

function OrderingAnswer({ part, onResult }: { part: OrderingPart; onResult: (result: AnswerCheckResult) => void }) {
  // A fresh attempt always requires an action, even when source order is ascending.
  const [valueIds, setValueIds] = useState(() => part.values.map((value) => value.id).reverse())
  const [feedback, setFeedback] = useState<AnswerCheckResult>()
  const drag = useRef<{ id: string; x: number; y: number; original: string[] } | null>(null)
  const [movingId, setMovingId] = useState<string>()
  const [announcement, setAnnouncement] = useState('')
  const move = (id: string, target: number) => {
    const index = valueIds.indexOf(id)
    if (target < 0 || target >= valueIds.length || index === target) return
    const next = valueIds.filter((value) => value !== id)
    next.splice(target, 0, id)
    setValueIds(next)
    setFeedback(undefined)
    setAnnouncement(`Позиция ${target + 1} из ${next.length}`)
  }
  return <form className="exercise-answer" onSubmit={(event) => { event.preventDefault(); const result = part.checkAnswer({ valueIds }); setFeedback(result); onResult(result) }}>
    <p>{part.prompt[0].value}</p>
    <p className="visually-hidden" id="ordering-help">Перетащите значение. Клавиши ↑ и ↓ меняют позицию, Home и End перемещают в начало и конец.</p>
    <ol className="power-order">{valueIds.map((id, index) => <li key={id} data-order-id={id}>
      <button type="button" className={`order-value${movingId === id ? ' is-moving' : ''}`} aria-describedby="ordering-help" aria-label={`Позиция ${index + 1}: ${part.values.find((value) => value.id === id)!.tex}`}
        onKeyDown={(event) => {
          const target = event.key === 'ArrowUp' ? index - 1 : event.key === 'ArrowDown' ? index + 1 : event.key === 'Home' ? 0 : event.key === 'End' ? valueIds.length - 1 : undefined
          if (target !== undefined) { event.preventDefault(); move(id, target) }
        }}
        onPointerDown={(event) => {
          if (event.button !== 0) return
          drag.current = { id, x: event.clientX, y: event.clientY, original: [...valueIds] }
          event.currentTarget.setPointerCapture(event.pointerId)
          event.currentTarget.focus()
        }}
        onPointerMove={(event) => {
          const active = drag.current
          if (!active || Math.hypot(event.clientX - active.x, event.clientY - active.y) < 6) return
          setMovingId(active.id)
          const row = document.elementFromPoint(event.clientX, event.clientY)?.closest<HTMLElement>('[data-order-id]')
          if (row && event.currentTarget.closest('ol')?.contains(row)) move(active.id, valueIds.indexOf(row.dataset.orderId!))
        }}
        onPointerUp={() => { drag.current = null; setMovingId(undefined) }}
        onPointerCancel={() => { if (drag.current) setValueIds(drag.current.original); drag.current = null; setMovingId(undefined) }}>
        <span className="order-grip" aria-hidden="true">⠿</span><Formula>{part.values.find((value) => value.id === id)!.tex}</Formula>
      </button>
    </li>)}</ol>
    <span className="visually-hidden" role="status">{announcement}</span>
    <button type="submit">Проверить</button>
    {feedback && <p role="status" className={feedback.correct ? 'answer-correct' : 'answer-error'}>{feedback.feedback}</p>}
    {feedback?.correct && <button type="button" onClick={() => { setValueIds(part.values.map((value) => value.id).reverse()); setFeedback(undefined) }}>Решить снова</button>}
  </form>
}

function ComparisonAnswer({ part, onResult }: { part: ExercisePartContent<'comparison'>; onResult: (result: AnswerCheckResult) => void }) {
  const [feedback, setFeedback] = useState<AnswerCheckResult>()
  return <div className="exercise-answer">
    {part.prompt.map((block, index) => block.kind === 'formula' ? <Formula key={index} display>{block.value}</Formula> : <p key={index}>{block.value}</p>)}
    {(['less', 'equal', 'greater'] as const).map((relation, index) => <button key={relation} type="button" aria-label={['Меньше', 'Равно', 'Больше'][index]} onClick={() => { const result = part.checkAnswer(relation); setFeedback(result); onResult(result) }}>{['<', '=', '>'][index]}</button>)}
    {feedback && <p role="status" className={feedback.correct ? 'answer-correct' : 'answer-error'}>{feedback.feedback}</p>}
    {feedback?.correct && <button type="button" onClick={() => setFeedback(undefined)}>Решить снова</button>}
  </div>
}

function GraphAnswer({ part, onResult }: { part: GraphPart; onResult: (result: AnswerCheckResult) => void }) {
  const [values, setValues] = useState(() => part.bases.map(() => ['', '', '']))
  const [domain, setDomain] = useState('')
  const [range, setRange] = useState('')
  const [asymptote, setAsymptote] = useState('')
  const [feedback, setFeedback] = useState<AnswerCheckResult>()
  const interval = (choice: string): ExerciseAnswers['graph']['curves'][number]['domain'] => choice === 'real'
    ? [{ lower: { value: '-infinity', included: false }, upper: { value: 'infinity', included: false } }]
    : choice === 'positive' ? [{ lower: { value: '0', included: false }, upper: { value: 'infinity', included: false } }] : []
  function submit(event: FormEvent) {
    event.preventDefault()
    const result = part.checkAnswer({ curves: values.map((ys, index) => ({
      id: `c${index + 1}`, points: ys.map((y, index) => ({ x: String(index - 1), y })), transformations: [],
      domain: interval(domain), range: interval(range), asymptotes: asymptote ? [{ axis: asymptote === 'x0' ? 'x' : 'y', value: asymptote === 'y1' ? '1' : '0' }] : [],
    })) })
    setFeedback(result)
    onResult(result)
  }
  const clearFeedback = () => setFeedback(undefined)
  return <form className="exercise-answer" onSubmit={submit}>
    {part.prompt.filter((block) => block.kind === 'text').map((block, index) => <p key={index}>{block.value}</p>)}
    {part.bases.map((base, curve) => <fieldset key={curve}>
      <legend>График {curve + 1}: <Formula>{`y=(${base.tex})^x`}</Formula></legend>
      <div className="coordinate-inputs">{[-1, 0, 1].map((x, index) => <label key={x}>y({x})
        <input aria-label={`График ${curve + 1}: y(${x})`} value={values[curve][index]} onChange={(event) => { setValues(values.map((row, rowIndex) => rowIndex === curve ? row.map((value, col) => col === index ? event.target.value : value) : row)); clearFeedback() }} />
      </label>)}</div>
    </fieldset>)}
    <GraphSketch values={values} />
    <p className="coordinate-notation">π = pi, √u = sqrt(u), ∛u = cbrt(u), корень степени n = u^(1/n). Допустима погрешность 0,01%.</p>
    <div className="coordinate-inputs">
      <label>Область определения<select aria-label="Область определения" value={domain} onChange={(event) => { setDomain(event.target.value); clearFeedback() }}><option value="">Выберите</option><option value="real">ℝ</option><option value="positive">(0; +∞)</option><option value="other">[0; +∞)</option></select></label>
      <label>Область значений<select aria-label="Область значений" value={range} onChange={(event) => { setRange(event.target.value); clearFeedback() }}><option value="">Выберите</option><option value="real">ℝ</option><option value="positive">(0; +∞)</option><option value="other">[0; +∞)</option></select></label>
      <label>Асимптота<select aria-label="Асимптота" value={asymptote} onChange={(event) => { setAsymptote(event.target.value); clearFeedback() }}><option value="">Выберите</option><option value="x0">x = 0</option><option value="y0">y = 0</option><option value="y1">y = 1</option></select></label>
    </div>
    <button type="submit">Проверить</button>
    {feedback && <p role="status" className={feedback.correct ? 'answer-correct' : 'answer-error'}>{feedback.feedback}</p>}
    {feedback?.correct && <button type="button" onClick={() => { setValues(part.bases.map(() => ['', '', ''])); setDomain(''); setRange(''); setAsymptote(''); clearFeedback() }}>Решить снова</button>}
  </form>
}

function GraphSketch({ values }: { values: string[][] }) {
  const colors = ['#3151b7', '#a33457', '#14806c']
  const coordinates = values.flat().map(readCoordinate).filter(Number.isFinite)
  const maximum = Math.max(2, ...coordinates)
  const minimum = Math.min(0, ...coordinates)
  const scale = 190 / (maximum - minimum)
  const baseline = 235 + minimum * scale
  return <svg className="exercise-sketch" viewBox="0 0 600 270" role="img" aria-label="Эскиз по введённым точкам">
    <defs><clipPath id="exercise-sketch-clip"><rect x="20" y="15" width="560" height="220" /></clipPath></defs>
    <path d={`M20 ${baseline}H580 M300 250V15`} fill="none" stroke="#6c6c6c" />
    <text x="583" y="230">x</text><text x="310" y="18">y</text>
    <text x="310" y={baseline - scale}>1</text>
    {coordinates.length === 0 && <text className="sketch-empty" x="310" y="85" textAnchor="middle">Введите y(−1), y(0), y(1)</text>}
    {[-2, -1, 0, 1, 2].map((x) => <text key={x} x={300 + x * 100 - 5} y="254">{x}</text>)}
    {values.map((row, index) => {
      const ys = row.map(readCoordinate)
      const complete = ys.every((y) => Number.isFinite(y) && y > 0)
      // Interpolate only learner coordinates. Never draw the expected answer.
      const points = complete ? Array.from({ length: 281 }, (_, step) => {
        const x = -2.8 + step / 50
        const segment = x <= 0 ? 0 : 1
        const offset = x <= 0 ? x + 1 : x
        const y = Math.exp(Math.log(ys[segment]) + (Math.log(ys[segment + 1]) - Math.log(ys[segment])) * offset)
        return `${300 + x * 100},${Math.max(-10000, baseline - y * scale)}`
      }).join(' ') : undefined
      return <g key={index} stroke={colors[index]} fill={colors[index]}>
        <g clipPath="url(#exercise-sketch-clip)">{points && <polyline points={points} fill="none" strokeWidth="2" strokeDasharray={['', '7 3', '2 3'][index]} />}{ys.map((y, col) => Number.isFinite(y) && <circle key={col} cx={200 + col * 100} cy={baseline - y * scale} r="4"><title>{`График ${index + 1}: (${col - 1}; ${y})`}</title></circle>)}</g>
        {ys.some(Number.isFinite) && <text stroke="none" x="25" y={25 + index * 20}>График {index + 1}</text>}
      </g>
    })}
  </svg>
}
