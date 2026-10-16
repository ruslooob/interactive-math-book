import { useState } from 'react'

export function UnderstandingCheck({ base }: { base: number }) {
  const [answer, setAnswer] = useState<'left' | 'right' | null>(null)
  const correct = base > 1 ? 'right' : 'left'
  const unavailable = Math.abs(base - 1) < 0.001

  return (
    <section className="understanding-check">
      <span className="eyebrow">Быстрая проверка</span>
      <strong>Где лежат решения неравенства aˣ &gt; c относительно точки равенства?</strong>
      <div>
        <button type="button" onClick={() => setAnswer('left')} disabled={unavailable}>Слева</button>
        <button type="button" onClick={() => setAnswer('right')} disabled={unavailable}>Справа</button>
      </div>
      <p className={answer ? (answer === correct ? 'is-correct' : 'is-wrong') : ''}>
        {unavailable
          ? 'При a = 1 сравнение не задаёт обратимую функцию.'
          : answer === null
            ? 'Сначала предскажи, затем проверь по закрашенной области в §§13 или 18.'
            : answer === correct
              ? `Да: функция ${base > 1 ? 'возрастает' : 'убывает'}, поэтому ответ именно там.`
              : `Посмотри на направление графика: при этом основании функция ${base > 1 ? 'возрастает' : 'убывает'}.`}
      </p>
    </section>
  )
}
