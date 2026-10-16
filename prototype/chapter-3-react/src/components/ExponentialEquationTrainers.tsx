import { useState } from 'react'
import { Formula } from './Formula'
import { TrainerChoiceList, TrainerFeedback, type TrainerChoice } from './TrainerControls'

type SolutionStep = {
  formula: string
  prompt: string
  insight: string
  choices: TrainerChoice[]
}

type CommonBaseTask = {
  equation: string
  commonBase: string
  rewrite: string
  choices: TrainerChoice[]
}

const commonBaseTasks: CommonBaseTask[] = [
  {
    equation: '4^x=8',
    commonBase: '2',
    rewrite: '2^{2x}=2^3',
    choices: [
      { id: '2', label: '2', correct: true, feedback: 'Верно: 4 = 2², а 8 = 2³.' },
      { id: '4', label: '4', feedback: 'Число 8 нельзя записать целой степенью основания 4.' },
      { id: '8', label: '8', feedback: 'Число 4 нельзя записать целой степенью основания 8.' },
    ],
  },
  {
    equation: '9^{x-1}=27',
    commonBase: '3',
    rewrite: '3^{2x-2}=3^3',
    choices: [
      { id: '3', label: '3', correct: true, feedback: 'Верно: 9 = 3², а 27 = 3³.' },
      { id: '9', label: '9', feedback: 'Число 27 не является целой степенью девяти.' },
      { id: '27', label: '27', feedback: 'Число 9 не является целой степенью двадцати семи.' },
    ],
  },
  {
    equation: '25^{x+1}=125^{2x}',
    commonBase: '5',
    rewrite: '5^{2x+2}=5^{6x}',
    choices: [
      { id: '5', label: '5', correct: true, feedback: 'Верно: 25 = 5², а 125 = 5³.' },
      { id: '25', label: '25', feedback: 'Число 125 нельзя записать целой степенью основания 25.' },
      { id: '10', label: '10', feedback: 'Ни 25, ни 125 не являются целыми степенями десяти.' },
    ],
  },
]

const solutionSteps: SolutionStep[] = [
  {
    formula: '4^x=8^{x-1}',
    prompt: 'Какое общее основание подходит?',
    insight: 'Основания 4 и 8 являются степенями двойки.',
    choices: [
      { id: 'base-2', label: 'Основание 2', correct: true, feedback: 'Верно: 4 = 2², а 8 = 2³.' },
      { id: 'base-4', label: 'Основание 4', feedback: 'Число 8 нельзя представить целой степенью четвёрки.' },
      { id: 'base-8', label: 'Основание 8', feedback: 'Число 4 нельзя представить целой степенью восьмёрки.' },
    ],
  },
  {
    formula: '2^{2x}=2^{3x-3}',
    prompt: 'Что можно сделать после приведения к основанию 2?',
    insight: 'Обе части стали значениями одной показательной функции.',
    choices: [
      { id: 'exponents', label: 'Приравнять показатели', correct: true, feedback: 'Верно: получаем 2x = 3x − 3.' },
      { id: 'add', label: 'Сложить показатели', feedback: 'Показатели складывают при умножении степеней, а здесь записано равенство.' },
      { id: 'divide', label: 'Разделить обе части на 2', feedback: 'Основание степени не является общим множителем всего выражения.' },
    ],
  },
  {
    formula: '2x=3x-3',
    prompt: 'Каков корень полученного уравнения?',
    insight: 'Теперь перед нами линейное уравнение.',
    choices: [
      { id: 'x-3', label: 'x = 3', correct: true, feedback: 'Верно: −x = −3, поэтому x = 3.' },
      { id: 'x-minus-3', label: 'x = −3', feedback: 'При переносе 3x влево получается −x = −3.' },
      { id: 'x-1', label: 'x = 1', feedback: 'При x = 1 равенство 2x = 3x − 3 не выполняется.' },
    ],
  },
  {
    formula: 'x=3',
    prompt: 'Какая подстановка проверяет корень?',
    insight: 'Проверка выполняется в исходном уравнении.',
    choices: [
      { id: 'check', label: '4³ = 8²', correct: true, feedback: 'Верно: обе части равны 64.' },
      { id: 'wrong-power', label: '4³ = 8³', feedback: 'Справа показатель равен x − 1, поэтому при x = 3 получаем 8².' },
      { id: 'transformed', label: '2 · 3 = 3 · 3', feedback: 'Проверять корень нужно в исходном уравнении.' },
    ],
  },
]

const progressLabels = ['Основание', 'Показатели', 'Корень', 'Проверка']

function CommonBaseTrainer() {
  const [taskIndex, setTaskIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const complete = taskIndex >= commonBaseTasks.length
  const task = complete ? null : commonBaseTasks[taskIndex]
  const selectedChoice = task?.choices.find((choice) => choice.id === selected) ?? null

  const next = () => {
    setTaskIndex((value) => value + 1)
    setSelected(null)
  }

  const reset = () => {
    setTaskIndex(0)
    setSelected(null)
  }

  return (
    <div className="animation-unit trainer-unit">
      <section className="concept-card common-base-workspace">
        <header>
          <span className="content-label">Тренажёр 1</span>
          <h2>Найти общее основание</h2>
        </header>
        {complete ? (
          <div className="trainer-result">
            <span aria-hidden="true">✓</span>
            <strong>Все основания найдены</strong>
            <p>Ты распознал степени двойки, тройки и пятёрки.</p>
          </div>
        ) : (
          <>
            <span className="trainer-counter">Задание {taskIndex + 1} из {commonBaseTasks.length}</span>
            <div className="common-base-equation"><Formula display>{task?.equation ?? ''}</Formula></div>
            {selectedChoice?.correct && (
              <div className="common-base-rewrite">
                <span>После преобразования</span>
                <Formula display>{task?.rewrite ?? ''}</Formula>
              </div>
            )}
          </>
        )}
      </section>

      <aside className="parameters-panel equation-actions">
        <header>
          <span className="content-label">Навык</span>
          <h2>{complete ? 'Тренажёр пройден' : 'Выбери основание'}</h2>
        </header>
        {complete ? (
          <div className="equation-complete">
            <button type="button" onClick={reset}>Пройти ещё раз</button>
          </div>
        ) : (
          <>
            <p className="equation-prompt">Какое число является общим основанием?</p>
            <TrainerChoiceList choices={task?.choices ?? []} selected={selected} onChoose={(choice) => setSelected(choice.id)} />
            <TrainerFeedback choice={selectedChoice} />
            {selectedChoice?.correct && <button className="trainer-next" type="button" onClick={next}>{taskIndex + 1 === commonBaseTasks.length ? 'Завершить' : 'Следующее задание'}</button>}
          </>
        )}
      </aside>
    </div>
  )
}

function EquationView({ step }: { step: number }) {
  if (step === 1) {
    return (
      <div className="matching-bases" key={step}>
        <article>
          <span className="matching-base-label">основание 2</span>
          <Formula display>{'2^{2x}'}</Formula>
        </article>
        <i aria-hidden="true">=</i>
        <article>
          <span className="matching-base-label">основание 2</span>
          <Formula display>{'2^{3x-3}'}</Formula>
        </article>
      </div>
    )
  }

  const formula = step < solutionSteps.length ? solutionSteps[step].formula : '4^3=8^2=64'
  return <div className="equation-formula" key={step}><Formula display>{formula}</Formula></div>
}

function CompleteEquationTrainer() {
  const [step, setStep] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const complete = step >= solutionSteps.length
  const current = complete ? null : solutionSteps[step]
  const selectedChoice = current?.choices.find((choice) => choice.id === selected) ?? null

  const next = () => {
    setStep((value) => value + 1)
    setSelected(null)
  }

  const reset = () => {
    setStep(0)
    setSelected(null)
  }

  return (
    <div className="animation-unit trainer-unit">
      <section className="concept-card equation-workspace">
        <header>
          <span className="content-label">Тренажёр 2</span>
          <h2>Решить уравнение полностью</h2>
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
          <p>{complete ? 'Подстановка подтверждает корень x = 3.' : current?.insight}</p>
        </div>
      </section>

      <aside className="parameters-panel equation-actions">
        <header>
          <span className="content-label">Навык</span>
          <h2>{complete ? 'Решение завершено' : `Шаг ${step + 1}`}</h2>
        </header>

        {complete ? (
          <div className="equation-complete">
            <span aria-hidden="true">✓</span>
            <strong>Ответ: x = 3</strong>
            <p>Основания приведены к двойке, показатели приравнены, корень проверен.</p>
            <button type="button" onClick={reset}>Решить ещё раз</button>
          </div>
        ) : (
          <>
            <p className="equation-prompt">{current?.prompt}</p>
            <TrainerChoiceList choices={current?.choices ?? []} selected={selected} onChoose={(choice) => setSelected(choice.id)} />
            <TrainerFeedback choice={selectedChoice} />
            {selectedChoice?.correct && <button className="trainer-next" type="button" onClick={next}>{step + 1 === solutionSteps.length ? 'Завершить решение' : 'Продолжить'}</button>}
          </>
        )}
      </aside>
    </div>
  )
}

export function ExponentialEquationTrainers() {
  return (
    <div className="trainer-stack">
      <CommonBaseTrainer />
      <CompleteEquationTrainer />
    </div>
  )
}
