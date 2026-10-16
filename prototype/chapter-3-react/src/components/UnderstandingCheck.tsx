import { useEffect, useState } from 'react'
import { describeBase, formatNumber } from '../lib/exponential'

type Direction = 'growth' | 'decay' | 'boundary'

export function UnderstandingCheck({ base }: { base: number }) {
  const [directionAnswer, setDirectionAnswer] = useState<Direction | null>(null)
  const [axisAnswer, setAxisAnswer] = useState<boolean | null>(null)
  const correctDirection = describeBase(base).tone

  useEffect(() => {
    setDirectionAnswer(null)
  }, [base])

  return (
    <section className="understanding-check">
      <div className="section-heading">
        <span className="content-label">Проверка понимания</span>
        <h2>Сформулируйте свойства без графика</h2>
      </div>
      <div className="check-grid">
        <article>
          <p>Что происходит с функцией при a = {formatNumber(base)}?</p>
          <div className="answer-buttons">
            <button type="button" onClick={() => setDirectionAnswer('growth')}>Возрастает</button>
            <button type="button" onClick={() => setDirectionAnswer('decay')}>Убывает</button>
            <button type="button" onClick={() => setDirectionAnswer('boundary')}>Постоянна</button>
          </div>
          {directionAnswer && (
            <span className={directionAnswer === correctDirection ? 'answer answer--correct' : 'answer answer--wrong'}>
              {directionAnswer === correctDirection
                ? correctDirection === 'boundary' ? 'Верно. Это исключённый случай a = 1.' : 'Верно. Это определяется положением a относительно 1.'
                : 'Проверьте, находится ли a между 0 и 1 или больше 1.'}
            </span>
          )}
        </article>
        <article>
          <p>Может ли график y = aˣ пересечь ось Ox?</p>
          <div className="answer-buttons">
            <button type="button" onClick={() => setAxisAnswer(true)}>Да</button>
            <button type="button" onClick={() => setAxisAnswer(false)}>Нет</button>
          </div>
          {axisAnswer !== null && (
            <span className={axisAnswer === false ? 'answer answer--correct' : 'answer answer--wrong'}>
              {axisAnswer === false ? 'Верно. При допустимом a значение aˣ всегда положительно.' : 'Нет. График только приближается к оси Ox.'}
            </span>
          )}
        </article>
      </div>
    </section>
  )
}
