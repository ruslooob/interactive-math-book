import { useEffect, useRef, useState } from 'react'
import type { QuizQuestion } from '../content/chapter3'

export function UnderstandingCheck({ questions, resetKey }: { questions: QuizQuestion[]; resetKey: string | number }) {
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const timer = useRef<number | null>(null)
  const complete = questionIndex >= questions.length

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
  }, [resetKey])

  const answer = (answerId: string) => {
    if (selected !== null || complete) return
    const isCorrect = answerId === questions[questionIndex].correct
    setSelected(answerId)
    if (isCorrect) setScore((current) => current + 1)
    timer.current = window.setTimeout(() => {
      setQuestionIndex((current) => current + 1)
      setSelected(null)
    }, 700)
  }

  const verdict = score === questions.length
    ? 'Все ответы верны. 🙂'
    : score >= Math.ceil(questions.length / 2)
      ? 'Основная идея понятна. Проверь ответ, в котором была ошибка.'
      : 'Вернись к свойствам и попробуй ещё раз.'

  return (
    <section className="understanding-check">
      <div className="section-heading">
        <span className="content-label">Проверка понимания</span>
        <h2>Проверь себя</h2>
      </div>

      <div className="question-progress" aria-label={`Вопрос ${Math.min(questionIndex + 1, questions.length)} из ${questions.length}`}>
        {questions.map((_, index) => <span className={index < questionIndex ? 'is-complete' : index === questionIndex ? 'is-current' : ''} key={index} />)}
      </div>

      {complete ? (
        <article className="final-verdict" aria-live="polite">
          <span>{score} из {questions.length}</span>
          <h3>{verdict}</h3>
          <button type="button" onClick={reset}>Пройти ещё раз</button>
        </article>
      ) : (
        <article className="question-card" aria-live="polite">
          <span>Вопрос {questionIndex + 1} из {questions.length}</span>
          <h3>{questions[questionIndex].text}</h3>
          <div className="answer-buttons">
            {questions[questionIndex].answers.map((item) => {
              const isSelected = selected === item.id
              const isCorrect = item.id === questions[questionIndex].correct
              const className = isSelected ? isCorrect ? 'is-correct' : 'is-wrong' : ''
              return <button className={className} disabled={selected !== null} key={item.id} type="button" onClick={() => answer(item.id)}>{item.label}</button>
            })}
          </div>
          {selected && <p className={selected === questions[questionIndex].correct ? 'answer answer--correct' : 'answer answer--wrong'}>{questions[questionIndex].explanation}</p>}
        </article>
      )}
    </section>
  )
}
