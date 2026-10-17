import { useState } from 'react'
import type { SkillTrainerModule } from '../content/skillTrainers'
import { Formula } from './Formula'
import { TrainerChoiceList, TrainerFeedback } from './TrainerControls'

function SkillTrainerModuleView({ module, number }: { module: SkillTrainerModule; number: number }) {
  const [taskIndex, setTaskIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const complete = taskIndex >= module.tasks.length
  const task = complete ? null : module.tasks[taskIndex]
  const selectedChoice = task?.choices.find((choice) => choice.id === selected) ?? null

  const next = () => {
    setTaskIndex((index) => index + 1)
    setSelected(null)
  }

  const reset = () => {
    setTaskIndex(0)
    setSelected(null)
  }

  return (
    <div className="animation-unit trainer-unit">
      <section className="concept-card skill-trainer-workspace">
        <header>
          <span className="content-label">Тренажёр {number}</span>
          <h2>{module.title}</h2>
        </header>

        {complete ? (
          <div className="trainer-result">
            <span aria-hidden="true">✓</span>
            <strong>Тренажёр пройден</strong>
            <p>{module.completion}</p>
          </div>
        ) : (
          <>
            <div className="skill-trainer-progress" aria-label={`Задание ${taskIndex + 1} из ${module.tasks.length}`}>
              {module.tasks.map((_, index) => <span className={index < taskIndex ? 'is-complete' : index === taskIndex ? 'is-current' : ''} key={index} />)}
            </div>
            <span className="trainer-counter">Задание {taskIndex + 1} из {module.tasks.length}</span>
            <div className="skill-trainer-formula"><Formula display>{task?.formula ?? ''}</Formula></div>
            {selectedChoice && <p className="skill-trainer-note">{task?.note}</p>}
            {selectedChoice?.correct && selectedChoice.result && (
              <div className="skill-trainer-result">
                <span>Результат действия</span>
                <Formula display>{selectedChoice.result}</Formula>
              </div>
            )}
          </>
        )}
      </section>

      <aside className="parameters-panel equation-actions">
        <header>
          <span className="content-label">Навык</span>
          <h2>{complete ? 'Результат' : module.skill}</h2>
        </header>
        {complete ? (
          <div className="equation-complete">
            <button type="button" onClick={reset}>Пройти ещё раз</button>
          </div>
        ) : (
          <>
            <p className="equation-prompt">{task?.prompt}</p>
            <TrainerChoiceList choices={task?.choices ?? []} selected={selected} onChoose={(choice) => setSelected(choice.id)} />
            <TrainerFeedback choice={selectedChoice} />
            {selectedChoice?.correct && <button className="trainer-next" type="button" onClick={next}>{taskIndex + 1 === module.tasks.length ? 'Завершить' : 'Следующее задание'}</button>}
          </>
        )}
      </aside>
    </div>
  )
}

export function SkillTrainerSet({ modules }: { modules: SkillTrainerModule[] }) {
  return (
    <div className="trainer-stack">
      {modules.map((module, index) => <SkillTrainerModuleView module={module} number={index + 1} key={module.title} />)}
    </div>
  )
}
