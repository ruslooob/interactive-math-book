import { useState, type FormEvent } from 'react'
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
  return <section className="exercise-practice graph-comparison-practice">
    <h3>Упражнение {exercise.id} · {exercise.parts[Math.min(partIndex, exercise.parts.length - 1)].letter}</h3>
    <p>{exercise.level === 'medium' ? '○ Средний уровень' : 'Простой уровень'}{solvedIds.has(part.id) ? ' · Решено' : ''}</p>
    <nav className="exercise-parts" aria-label="Части упражнения">
      {exercise.parts.map((item, index) => <button type="button" key={item.id}
        className={solvedIds.has(item.id) ? 'is-solved' : undefined}
        aria-current={part.id === item.id ? 'step' : undefined}
        aria-label={`Часть ${item.letter}${solvedIds.has(item.id) ? ' — решено' : ''}`}
        onClick={() => setPartIndex(index)}>{item.letter}</button>)}
    </nav>
    {part.kind === 'graph' && <GraphAnswer key={part.id} part={part as GraphPart} onResult={(result) => onResult(part.id, result)} />}
    {part.kind === 'comparison' && <ComparisonAnswer key={part.id} part={part} onResult={(result) => onResult(part.id, result)} />}
    {part.kind === 'ordering' && <OrderingAnswer key={part.id} part={part as OrderingPart} onResult={(result) => onResult(part.id, result)} />}
  </section>
}

function OrderingAnswer({ part, onResult }: { part: OrderingPart; onResult: (result: AnswerCheckResult) => void }) {
  // A fresh attempt always requires an action, even when source order is ascending.
  const [valueIds, setValueIds] = useState(() => part.values.map((value) => value.id).reverse())
  const [feedback, setFeedback] = useState<AnswerCheckResult>()
  const move = (index: number, offset: number) => {
    const next = [...valueIds]
    const target = index + offset
    const moved = next[index]
    next[index] = next[target]
    next[target] = moved
    setValueIds(next)
    setFeedback(undefined)
  }
  return <form className="exercise-answer" onSubmit={(event) => { event.preventDefault(); const result = part.checkAnswer({ valueIds }); setFeedback(result); onResult(result) }}>
    <p>{part.prompt[0].value}</p>
    <ol className="power-order">{valueIds.map((id, index) => <li key={id}>
      <Formula>{part.values.find((value) => value.id === id)!.tex}</Formula>
      <span><button type="button" disabled={index === 0} aria-label={`Позиция ${index + 1}: выше`} onClick={() => move(index, -1)}>↑</button>
        <button type="button" disabled={index === valueIds.length - 1} aria-label={`Позиция ${index + 1}: ниже`} onClick={() => move(index, 1)}>↓</button></span>
    </li>)}</ol>
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
    {part.prompt.map((block, index) => block.kind === 'formula' ? <Formula key={index} display>{block.value}</Formula> : <p key={index}>{block.value}</p>)}
    {part.bases.map((base, curve) => <fieldset key={curve}>
      <legend>График {curve + 1}: <Formula>{`y=(${base.tex})^x`}</Formula></legend>
      <div className="coordinate-inputs">{[-1, 0, 1].map((x, index) => <label key={x}>y({x})
        <input aria-label={`График ${curve + 1}: y(${x})`} value={values[curve][index]} onChange={(event) => { setValues(values.map((row, rowIndex) => rowIndex === curve ? row.map((value, col) => col === index ? event.target.value : value) : row)); clearFeedback() }} />
      </label>)}</div>
    </fieldset>)}
    <p className="coordinate-notation">π = pi, √u = sqrt(u), ∛u = cbrt(u), корень степени n = u^(1/n). Допустима погрешность 0,01%.</p>
    <div className="coordinate-inputs">
      <label>Область определения<select aria-label="Область определения" value={domain} onChange={(event) => { setDomain(event.target.value); clearFeedback() }}><option value="">Выберите</option><option value="real">ℝ</option><option value="positive">(0; +∞)</option><option value="other">[0; +∞)</option></select></label>
      <label>Область значений<select aria-label="Область значений" value={range} onChange={(event) => { setRange(event.target.value); clearFeedback() }}><option value="">Выберите</option><option value="real">ℝ</option><option value="positive">(0; +∞)</option><option value="other">[0; +∞)</option></select></label>
      <label>Асимптота<select aria-label="Асимптота" value={asymptote} onChange={(event) => { setAsymptote(event.target.value); clearFeedback() }}><option value="">Выберите</option><option value="x0">x = 0</option><option value="y0">y = 0</option><option value="y1">y = 1</option></select></label>
    </div>
    <GraphSketch values={values} />
    <button type="submit">Проверить</button>
    {feedback && <p role="status" className={feedback.correct ? 'answer-correct' : 'answer-error'}>{feedback.feedback}</p>}
    {feedback?.correct && <button type="button" onClick={() => { setValues(part.bases.map(() => ['', '', ''])); setDomain(''); setRange(''); setAsymptote(''); clearFeedback() }}>Решить снова</button>}
  </form>
}

function GraphSketch({ values }: { values: string[][] }) {
  const colors = ['#3151b7', '#a33457', '#14806c']
  const maximum = Math.max(2, ...values.flat().map(readCoordinate).filter(Number.isFinite))
  const scale = 190 / maximum
  return <svg className="exercise-sketch" viewBox="0 0 600 270" role="img" aria-label="Эскиз по введённым точкам">
    <defs><clipPath id="exercise-sketch-clip"><rect x="20" y="15" width="560" height="220" /></clipPath></defs>
    <path d="M20 235H580 M300 250V15" fill="none" stroke="#6c6c6c" />
    <text x="583" y="230">x</text><text x="310" y="18">y</text>
    <text x="310" y={235 - scale}>1</text>
    {[-2, -1, 0, 1, 2].map((x) => <text key={x} x={300 + x * 100 - 5} y="254">{x}</text>)}
    {values.map((row, index) => {
      const ys = row.map(readCoordinate)
      if (!ys.every((y) => Number.isFinite(y) && y > 0)) return null
      // Interpolate only learner coordinates. Never draw the expected answer.
      const points = Array.from({ length: 281 }, (_, step) => {
        const x = -2.8 + step / 50
        const segment = x <= 0 ? 0 : 1
        const offset = x <= 0 ? x + 1 : x
        const y = Math.exp(Math.log(ys[segment]) + (Math.log(ys[segment + 1]) - Math.log(ys[segment])) * offset)
        return `${300 + x * 100},${Math.max(-10000, 235 - y * scale)}`
      }).join(' ')
      return <g key={index} stroke={colors[index]} fill={colors[index]}>
        <g clipPath="url(#exercise-sketch-clip)"><polyline points={points} fill="none" strokeWidth="2" strokeDasharray={['', '7 3', '2 3'][index]} />{ys.map((y, col) => <circle key={col} cx={200 + col * 100} cy={235 - y * scale} r="4" />)}</g>
        <text stroke="none" x="25" y={25 + index * 20}>График {index + 1}</text>
      </g>
    })}
  </svg>
}
