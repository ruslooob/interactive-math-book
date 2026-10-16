import { useEffect, useMemo, useState } from 'react'
import type { AnimationActions, AnimationState } from './components/AnimationParameters'
import { ParagraphPrototype } from './components/ParagraphPrototype'

function initialBase() {
  const value = Number(new URLSearchParams(window.location.search).get('base'))
  return Number.isFinite(value) && value >= 0.2 && value <= 4 ? value : 2
}

export function App() {
  const [base, setBase] = useState(initialBase)

  useEffect(() => {
    const url = new URL(window.location.href)
    url.searchParams.set('base', String(Number(base.toFixed(3))))
    for (const obsoleteParameter of ['variant', 'x', 'anchor', 'asymptote', 'table']) {
      url.searchParams.delete(obsoleteParameter)
    }
    window.history.replaceState({}, '', url)
  }, [base])

  const state: AnimationState = useMemo(() => ({ base }), [base])
  const actions: AnimationActions = { setBase }

  return <ParagraphPrototype state={state} actions={actions} />
}
