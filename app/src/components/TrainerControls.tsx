export type TrainerChoice = {
  id: string
  label: string
  correct?: boolean
  feedback: string
  result?: string
}

export function TrainerChoiceList({ choices, selected, onChoose }: { choices: TrainerChoice[]; selected: string | null; onChoose: (choice: TrainerChoice) => void }) {
  const correctSelected = choices.some((choice) => choice.id === selected && choice.correct)

  return (
    <div className="equation-action-list">
      {choices.map((choice) => {
        const isSelected = selected === choice.id
        const className = isSelected ? choice.correct ? 'is-correct' : 'is-wrong' : ''
        return (
          <button className={className} disabled={correctSelected} key={choice.id} type="button" onClick={() => onChoose(choice)}>
            {choice.label}
          </button>
        )
      })}
    </div>
  )
}

export function TrainerFeedback({ choice }: { choice: TrainerChoice | null }) {
  if (!choice) return null
  return <p className={`equation-feedback ${choice.correct ? 'is-correct' : 'is-wrong'}`} aria-live="polite">{choice.feedback}</p>
}
