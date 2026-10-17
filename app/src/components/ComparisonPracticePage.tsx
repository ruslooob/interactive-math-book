import { useEffect, useState, type CSSProperties, type KeyboardEvent } from 'react'
import {
  comparisonSubpoints,
  isExerciseComplete,
  type ComparisonAnswer,
} from '../content/practice11'
import { Formula } from './Formula'

type ComparisonPracticePageProps = {
  currentIndex: number
  solvedSubpointIds: ReadonlySet<string>
  onSelectSubpoint: (index: number) => void
  onSolveSubpoint: (subpointId: string) => void
}

export function ComparisonPracticePage({
  currentIndex,
  solvedSubpointIds,
  onSelectSubpoint,
  onSolveSubpoint,
}: ComparisonPracticePageProps) {
  const [answer, setAnswer] = useState<ComparisonAnswer | ''>('')
  const [feedback, setFeedback] = useState<{ correct: boolean; text: string } | null>(null)
  const subpoint = comparisonSubpoints[currentIndex]
  const exerciseComplete = isExerciseComplete(subpoint.exercise, solvedSubpointIds)

  useEffect(() => {
    setAnswer('')
    setFeedback(null)
  }, [currentIndex])

  const checkAnswer = () => {
    if (!answer) {
      setFeedback({ correct: false, text: 'Выберите знак сравнения.' })
      return
    }
    if (answer === subpoint.answer) {
      onSolveSubpoint(subpoint.id)
      setFeedback({ correct: true, text: subpoint.success })
      return
    }
    setFeedback({ correct: false, text: 'Проверьте основание функции и сначала сравните показатели.' })
  }

  const handleSegmentKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const direction = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0
    if (!direction) return
    event.preventDefault()
    const nextIndex = (index + direction + comparisonSubpoints.length) % comparisonSubpoints.length
    onSelectSubpoint(nextIndex)
    window.requestAnimationFrame(() => {
      document.querySelector<HTMLButtonElement>(`[data-segment-index="${nextIndex}"]`)?.focus()
    })
  }

  return (
    <div className="practice-surface">
      <span className="page-label">Практическая страница</span>
      <h2 className="practice-title">⚖️ Сравните значения функции</h2>

      <article className="task-card comparison-practice">
        <div className="task-card__top">
          <div className="segment-navigation">
            <div className="segments" style={{ '--segment-count': comparisonSubpoints.length } as CSSProperties} aria-label="Подпункты практической страницы">
              {comparisonSubpoints.map((item, index) => {
                const solved = solvedSubpointIds.has(item.id)
                const current = index === currentIndex
                const status = current
                  ? `текущий, ${solved ? 'решён' : 'не решён'}`
                  : solved ? 'решён' : 'не решён'
                return (
                  <button
                    className={`segment${solved ? ' is-solved' : ''}${current ? ' is-current' : ''}`}
                    type="button"
                    aria-label={`${index + 1} из ${comparisonSubpoints.length}: ${status}`}
                    aria-current={current ? 'step' : undefined}
                    data-segment-index={index}
                    key={item.id}
                    onClick={() => onSelectSubpoint(index)}
                    onKeyDown={(event) => handleSegmentKeyDown(event, index)}
                  />
                )
              })}
            </div>
            <span className="segment-position">{currentIndex + 1} из {comparisonSubpoints.length}</span>
          </div>
          <div className="stream-context">
            <span aria-label={`Упражнение ${subpoint.exercise}: ${exerciseComplete ? 'завершено' : 'не завершено'}`}>
              Упражнение {subpoint.exercise}{exerciseComplete && <b aria-hidden="true"> ✓</b>}
            </span>
            <span>Подпункт {subpoint.subpoint}</span>
          </div>
        </div>

        <div className="task-card__body">
          <div className="task-heading-row">
            <div><span className="task-eyebrow">Текущий подпункт</span><h3>Сравните значения</h3></div>
          </div>
          <p className="condition">Выберите знак между выражениями.</p>
          <div className="math-line">
            <Formula>{subpoint.left}</Formula>
            <select
              className="comparison-select"
              aria-label="Знак сравнения"
              value={answer}
              onChange={(event) => setAnswer(event.target.value as ComparisonAnswer | '')}
            >
              <option value="">?</option>
              <option value="less">&lt;</option>
              <option value="equal">=</option>
              <option value="greater">&gt;</option>
            </select>
            <Formula>{subpoint.right}</Formula>
          </div>
          <button className="check-button" type="button" onClick={checkAnswer}>Проверить</button>
          <p className={`feedback${feedback && !feedback.correct ? ' is-wrong' : ''}`} aria-live="polite">
            {feedback?.text}
          </p>
        </div>
      </article>
    </div>
  )
}
