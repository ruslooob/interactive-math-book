import type { InteractiveKind } from '../content/chapter3'
import { skillTrainerSets } from '../content/skillTrainers'
import type { AnimationActions, AnimationState } from './AnimationParameters'
import { AnimationUnit } from './AnimationUnit'
import { ExponentialEquationTrainers } from './ExponentialEquationTrainers'
import { SkillTrainerSet } from './SkillTrainer'
import {
  ComparisonAnimation,
  DerivativeAnimation,
  LogarithmDefinitionAnimation,
  LogarithmicFunctionAnimation,
  LogarithmPropertiesAnimation,
} from './ConceptAnimations'

export function InteractiveStage({ kind, state, actions }: { kind: InteractiveKind; state: AnimationState; actions: AnimationActions }) {
  switch (kind) {
    case 'exponential-function':
      return <AnimationUnit state={state} actions={actions} />
    case 'exponential-equation':
      return <ExponentialEquationTrainers />
    case 'exponential-inequality':
      return <ComparisonAnimation family="exponential" mode="inequality" />
    case 'exponential-inequality-trainer':
    case 'logarithm-properties-trainer':
    case 'logarithmic-equation-trainer':
    case 'logarithmic-inequality-trainer':
    case 'derivatives-trainer':
      return <SkillTrainerSet modules={skillTrainerSets[kind] ?? []} />
    case 'logarithm-definition':
      return <LogarithmDefinitionAnimation />
    case 'logarithmic-function':
      return <LogarithmicFunctionAnimation />
    case 'logarithm-properties':
      return <LogarithmPropertiesAnimation />
    case 'logarithmic-equation':
      return <ComparisonAnimation family="logarithmic" mode="equation" />
    case 'logarithmic-inequality':
      return <ComparisonAnimation family="logarithmic" mode="inequality" />
    case 'derivatives':
      return <DerivativeAnimation />
  }
}
