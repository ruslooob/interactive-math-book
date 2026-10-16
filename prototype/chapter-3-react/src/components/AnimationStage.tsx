import type { AnimationKind } from '../content/chapter3'
import type { AnimationActions, AnimationState } from './AnimationParameters'
import { AnimationUnit } from './AnimationUnit'
import {
  ComparisonAnimation,
  DerivativeAnimation,
  LogarithmDefinitionAnimation,
  LogarithmicFunctionAnimation,
  LogarithmPropertiesAnimation,
} from './ConceptAnimations'

export function AnimationStage({ kind, state, actions }: { kind: AnimationKind; state: AnimationState; actions: AnimationActions }) {
  switch (kind) {
    case 'exponential-function':
      return <AnimationUnit state={state} actions={actions} />
    case 'exponential-equation':
      return <ComparisonAnimation family="exponential" mode="equation" />
    case 'exponential-inequality':
      return <ComparisonAnimation family="exponential" mode="inequality" />
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
