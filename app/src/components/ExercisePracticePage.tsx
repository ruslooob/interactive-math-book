import { useState } from 'react'
import { availableParagraph11Exercises, paragraph11ExerciseContent, type AnyExercisePartContent, type AnswerCheckResult } from '../content/exerciseContent'
import type { ExercisePartId } from '../content/paragraph11Catalog'
import { Formula } from './Formula'

const available = availableParagraph11Exercises(paragraph11ExerciseContent)

function PartAnswer({ part, onResult }: { part: AnyExercisePartContent; onResult: (id: ExercisePartId, result: AnswerCheckResult) => void }) {
  const [values, setValues] = useState<string[]>(() => (part.answerLabels ?? ['Ответ']).map(() => ''))
  const [selectedId, setSelectedId] = useState('')
  const [result, setResult] = useState<AnswerCheckResult | null>(null)
  const submit = () => {
    const checked = part.kind === 'calculated-values' ? part.checkAnswer({ values })
      : part.kind === 'choices' ? part.checkAnswer({ selectedIds: [selectedId] }) : null
    if (checked) {
      setResult(checked)
      onResult(part.id, checked)
    }
  }
  return (
    <div className="task-card__body">
      {part.prompt.map((block, index) => block.kind === 'formula'
        ? <div className="exercise-formula" key={index}><Formula display>{block.value}</Formula></div>
        : <p className="condition" key={index}>{block.value}</p>)}
      <form onSubmit={(event) => { event.preventDefault(); submit() }}>
        {part.kind === 'calculated-values' && <div className="exercise-inputs">
          {(part.answerLabels ?? ['Ответ']).map((label, index) => <label key={index}>
            <span>{label}</span>
            <input type="text" required autoComplete="off" spellCheck={false} value={values[index]}
              aria-describedby="answer-notation"
              onChange={(event) => { setValues(values.map((value, i) => i === index ? event.target.value : value)); setResult(null) }} />
          </label>)}
          <small id="answer-notation">Дробь: a/b · степень: a^(p/q) · корень: sqrt(a), root(n;a)</small>
        </div>}
        {part.kind === 'choices' && <fieldset className="exercise-choices">
          <legend>Ваш ответ</legend>
          {part.choices?.map((choice) => <label key={choice.id}>
            <input type="radio" name="answer" required value={choice.id} checked={selectedId === choice.id}
              onChange={() => { setSelectedId(choice.id); setResult(null) }} />{choice.label}
          </label>)}
        </fieldset>}
        <button type="submit" className="check-button">Проверить</button>
      </form>
      <div role="status" className={`feedback${result?.correct === false ? ' is-wrong' : ''}`}>
        {result && <><strong>{result.correct ? 'Верно. ' : 'Пока неверно. '}</strong>{result.feedback}</>}
      </div>
    </div>
  )
}

export function ExercisePracticePage({ title, pageId, exerciseId, solvedIds, onResult }: {
  title: string
  pageId: string
  exerciseId?: string
  solvedIds: ReadonlySet<ExercisePartId>
  onResult: (id: ExercisePartId, result: AnswerCheckResult) => void
}) {
  const exercises = available.filter((exercise) => exercise.practiceGroup === pageId)
  const exercise = exercises.find((item) => item.id === exerciseId) ?? exercises[0]
  const [partIndex, setPartIndex] = useState(0)
  const [replay, setReplay] = useState(0)
  if (!exercise) return null
  const part = exercise.content.parts[partIndex]
  const complete = exercise.parts.every((item) => solvedIds.has(item.id))
  return (
    <div className="practice-surface">
      <span className="page-label">Практическая страница</span>
      <h2 className="practice-title">{title}</h2>
      <section className="task-card exercise-practice" aria-label={`Упражнение ${exercise.id}`}>
        <header className="task-card__top">
          <div className="task-heading-row">
            <h3>Упражнение {exercise.id}</h3>
            <span className="exercise-level">{exercise.level === 'simple' ? 'Простой уровень' : exercise.level === 'medium' ? '○ Средний уровень' : '● Продвинутый уровень'}</span>
          </div>
          <nav className="exercise-parts" aria-label="Части упражнения">
            {exercise.parts.map((item, index) => <button type="button" key={item.id}
              className={solvedIds.has(item.id) ? 'is-solved' : undefined}
              aria-current={index === partIndex ? 'step' : undefined}
              aria-label={`Часть ${item.letter}${solvedIds.has(item.id) ? ' — решено' : ''}`}
              onClick={() => setPartIndex(index)}>{item.letter}</button>)}
          </nav>
        </header>
        <PartAnswer key={`${part.id}-${replay}`} part={part} onResult={onResult} />
        {complete && <div className="exercise-complete" role="status">
          <strong>Все части упражнения {exercise.id} решены.</strong>
          <button type="button" onClick={() => { setPartIndex(0); setReplay((value) => value + 1) }}>Решить ещё раз</button>
        </div>}
      </section>
    </div>
  )
}
