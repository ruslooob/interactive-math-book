import { useEffect, useRef, useState } from 'react'
import { Formula } from './Formula'

type Action = {
  id: string
  label: string
  correct?: boolean
  feedback: string
}

type SolutionStep = {
  formula: string
  prompt: string
  insight: string
  actions: Action[]
}

const solutionSteps: SolutionStep[] = [
  {
    formula: '3^{2x-1}=27',
    prompt: 'Что нужно сделать сначала?',
    insight: 'Чтобы сравнить показатели, обе части нужно представить как степени одного основания.',
    actions: [
      { id: 'rewrite', label: 'Представить 27 как 3³', correct: true, feedback: 'Верно: 27 = 3³.' },
      { id: 'equate', label: 'Приравнять 2x − 1 и 27', feedback: 'Пока основания не совпадают: справа записано число 27, а не показатель степени.' },
      { id: 'subtract', label: 'Вычесть 27 из показателя', feedback: 'Такое преобразование не сохраняет равенство.' },
    ],
  },
  {
    formula: '3^{2x-1}=3^3',
    prompt: 'Основания совпали. Что можно сделать?',
    insight: 'Одинаковая показательная функция принимает одинаковые значения только при одинаковых показателях.',
    actions: [
      { id: 'exponents', label: 'Приравнять показатели', correct: true, feedback: 'Верно: одинаковый внешний слой 3^(□) можно убрать.' },
      { id: 'add', label: 'Сложить показатели', feedback: 'Сложение показателей применяется при умножении степеней, а здесь записано равенство.' },
      { id: 'divide', label: 'Разделить показатели на 3', feedback: 'Основание не является общим множителем показателей.' },
    ],
  },
  {
    formula: '2x-1=3',
    prompt: 'Каким стало уравнение?',
    insight: 'Показательный слой исчез. Осталось обычное линейное уравнение.',
    actions: [
      { id: 'linear', label: 'Решить линейное уравнение', correct: true, feedback: 'Верно: 2x = 4, поэтому x = 2.' },
      { id: 'power', label: 'Возвести обе части в квадрат', feedback: 'Это усложнит уравнение и не поможет выделить x.' },
    ],
  },
  {
    formula: 'x=2',
    prompt: 'Что сделать с найденным корнем?',
    insight: 'Последний шаг решения — проверка в исходном уравнении.',
    actions: [
      { id: 'check', label: 'Подставить x = 2', correct: true, feedback: 'Получаем 3³ = 27. Равенство верно.' },
      { id: 'finish', label: 'Сразу записать ответ', feedback: 'Ответ найден, но проверка подтверждает, что преобразования выполнены верно.' },
    ],
  },
]

const progressLabels = ['Основание', 'Показатели', 'Решение', 'Проверка']

function EquationView({ step }: { step: number }) {
  if (step === 1) {
    return (
      <div className="matching-bases" key={step}>
        <article>
          <span className="matching-base-label">основание 3</span>
          <Formula display>{'3^{2x-1}'}</Formula>
        </article>
        <i aria-hidden="true">=</i>
        <article>
          <span className="matching-base-label">основание 3</span>
          <Formula display>{'3^3'}</Formula>
        </article>
      </div>
    )
  }

  const formula = step < solutionSteps.length ? solutionSteps[step].formula : '3^{2\cdot2-1}=3^3=27'
  return <div className="equation-formula" key={step}><Formula display>{formula}</Formula></div>
}

export function ExponentialEquationAnimation() {
  const [step, setStep] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)
  const timer = useRef<number | null>(null)
  const complete = step >= solutionSteps.length
  const current = complete ? null : solutionSteps[step]

  useEffect(() => () => {
    if (timer.current !== null) window.clearTimeout(timer.current)
  }, [])

  const chooseAction = (action: Action) => {
    if (selected && current?.actions.find((item) => item.id === selected)?.correct) return
    setSelected(action.id)
    setFeedback(action.feedback)
    if (!action.correct) return
    timer.current = window.setTimeout(() => {
      setStep((value) => value + 1)
      setSelected(null)
      setFeedback(null)
    }, 850)
  }

  const reset = () => {
    if (timer.current !== null) window.clearTimeout(timer.current)
    setStep(0)
    setSelected(null)
    setFeedback(null)
  }

  return (
    <div className="animation-unit equation-animation">
      <section className="concept-card equation-workspace">
        <header>
          <span className="content-label">Интерактивная анимация</span>
          <h2>Решаем <Formula>{'3^{2x-1}=27'}</Formula></h2>
        </header>

        <div className="equation-progress" aria-label={`Шаг ${Math.min(step + 1, solutionSteps.length)} из ${solutionSteps.length}`}>
          {progressLabels.map((label, index) => (
            <div className={index < step ? 'is-complete' : index === step ? 'is-current' : ''} key={label}>
              <span>{index + 1}</span>
              <strong>{label}</strong>
            </div>
          ))}
        </div>

        <div className="equation-stage">
          <EquationView step={step} />
          <p>{complete ? 'Левая часть равна правой. Корень x = 2 найден верно.' : current?.insight}</p>
        </div>
      </section>

      <aside className="parameters-panel equation-actions">
        <header>
          <span className="content-label">Действие</span>
          <h2>{complete ? 'Решение завершено' : `Шаг ${step + 1}`}</h2>
        </header>

        {complete ? (
          <div className="equation-complete">
            <span aria-hidden="true">✓</span>
            <strong>Ответ: x = 2</strong>
            <p>Уравнение приведено к одному основанию, показатели приравнены, корень проверен.</p>
            <button type="button" onClick={reset}>Пройти ещё раз</button>
          </div>
        ) : (
          <>
            <p className="equation-prompt">{current?.prompt}</p>
            <div className="equation-action-list">
              {current?.actions.map((action) => {
                const isSelected = selected === action.id
                const className = isSelected ? action.correct ? 'is-correct' : 'is-wrong' : ''
                return (
                  <button className={className} disabled={Boolean(selected && current.actions.find((item) => item.id === selected)?.correct)} key={action.id} type="button" onClick={() => chooseAction(action)}>
                    {action.label}
                  </button>
                )
              })}
            </div>
            {feedback && <p className={current?.actions.find((action) => action.id === selected)?.correct ? 'equation-feedback is-correct' : 'equation-feedback is-wrong'}>{feedback}</p>}
          </>
        )}
      </aside>
    </div>
  )
}
