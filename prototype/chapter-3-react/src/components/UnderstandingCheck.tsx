import { useEffect, useRef, useState } from 'react'
import { describeBase, formatNumber } from '../lib/exponential'

type Answer = {
  id: string
  label: string
}

type Question = {
  text: string
  answers: Answer[]
  correct: string
  explanation: string
}

function questions(base: number): Question[] {
  const direction = describeBase(base).tone
  return [
    {
      text: `Что происходит с функцией при a = ${formatNumber(base)}?`,
      answers: [
        { id: 'growth', label: 'Возрастает' },
        { id: 'decay', label: 'Убывает' },
        { id: 'boundary', label: 'Постоянна' },
      ],
      correct: direction,
      explanation: direction === 'boundary'
        ? 'При a = 1 получается исключённый случай y = 1.'
        : 'Направление определяется положением основания относительно единицы.',
    },
    {
      text: 'Может ли график показательной функции пересечь ось Ox?',
      answers: [
        { id: 'yes', label: 'Да' },
        { id: 'no', label: 'Нет' },
      ],
      correct: 'no',
      explanation: 'Значение aˣ всегда положительно, поэтому график только приближается к оси Ox.',
    },
    {
      text: 'Через какую точку проходят все показательные графики?',
      answers: [
        { id: 'zero', label: '(0; 0)' },
        { id: 'one', label: '(0; 1)' },
        { id: 'base', label: '(a; 1)' },
      ],
      correct: 'one',
      explanation: 'При x = 0 значение a⁰ равно 1 для любого допустимого основания.',
    },
  ]
}

export function UnderstandingCheck({ base }: { base: number }) {
  const items = questions(base)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const timer = useRef<number | null>(null)
  const complete = questionIndex >= items.length

  const reset = () => {
    if (timer.current !== null) window.clearTimeout(timer.current)
    setQuestionIndex(0)
    setSelected(null)
    setScore(0)
  }

  useEffect(() => {
    reset()
    return () => {
      if (timer.current !== null) window.clearTimeout(timer.current)
    }
  }, [base])

  const answer = (answerId: string) => {
    if (selected !== null || complete) return
    const isCorrect = answerId === items[questionIndex].correct
    setSelected(answerId)
    if (isCorrect) setScore((current) => current + 1)
    timer.current = window.setTimeout(() => {
      setQuestionIndex((current) => current + 1)
      setSelected(null)
    }, 700)
  }

  const verdict = score === items.length
    ? 'Все свойства применены верно.'
    : score >= 2
      ? 'Основная идея понятна. Проверьте свойство, в котором была ошибка.'
      : 'Вернитесь к списку свойств и повторите проверку.'

  return (
    <section className="understanding-check">
      <div className="section-heading">
        <span className="content-label">Проверка понимания</span>
        <h2>Проверьте себя</h2>
      </div>

      <div className="question-progress" aria-label={`Вопрос ${Math.min(questionIndex + 1, items.length)} из ${items.length}`}>
        {items.map((_, index) => <span className={index < questionIndex ? 'is-complete' : index === questionIndex ? 'is-current' : ''} key={index} />)}
      </div>

      {complete ? (
        <article className="final-verdict" aria-live="polite">
          <span>{score} из {items.length}</span>
          <h3>{verdict}</h3>
          <button type="button" onClick={reset}>Пройти ещё раз</button>
        </article>
      ) : (
        <article className="question-card" aria-live="polite">
          <span>Вопрос {questionIndex + 1} из {items.length}</span>
          <h3>{items[questionIndex].text}</h3>
          <div className="answer-buttons">
            {items[questionIndex].answers.map((item) => {
              const isSelected = selected === item.id
              const isCorrect = item.id === items[questionIndex].correct
              const className = isSelected ? isCorrect ? 'is-correct' : 'is-wrong' : ''
              return <button className={className} disabled={selected !== null} key={item.id} type="button" onClick={() => answer(item.id)}>{item.label}</button>
            })}
          </div>
          {selected && <p className={selected === items[questionIndex].correct ? 'answer answer--correct' : 'answer answer--wrong'}>{items[questionIndex].explanation}</p>}
        </article>
      )}
    </section>
  )
}
