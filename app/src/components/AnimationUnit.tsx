import type { AnimationActions, AnimationState } from './AnimationParameters'
import { AnimationParameters } from './AnimationParameters'
import { ExponentialGraph } from './ExponentialGraph'

export function AnimationUnit({ state, actions }: { state: AnimationState; actions: AnimationActions }) {
  return (
    <div className="animation-unit">
      <ExponentialGraph base={state.base} />
      <AnimationParameters state={state} actions={actions} />
    </div>
  )
}
