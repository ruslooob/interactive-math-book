import { useEffect, useMemo, useState } from 'react'
import type { AnimationActions, AnimationState } from './components/AnimationParameters'
import { PrototypeSwitcher, variants, type VariantId } from './components/PrototypeSwitcher'
import { VariantA, VariantB, VariantC } from './components/Variants'

function query() {
  return new URLSearchParams(window.location.search)
}

function initialVariant(): VariantId {
  const value = query().get('variant')?.toUpperCase()
  return value === 'B' || value === 'C' ? value : 'A'
}

function initialNumber(name: string, fallback: number, minimum: number, maximum: number) {
  const value = Number(query().get(name))
  return Number.isFinite(value) && value >= minimum && value <= maximum ? value : fallback
}

function initialBoolean(name: string, fallback: boolean) {
  const value = query().get(name)
  if (value === '1') return true
  if (value === '0') return false
  return fallback
}

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  return target.matches('input, textarea, select, [contenteditable="true"]')
}

export function App() {
  const [variant, setVariant] = useState<VariantId>(initialVariant)
  const [base, setBase] = useState(() => initialNumber('base', 2, 0.2, 4))
  const [selectedX, setSelectedX] = useState(() => initialNumber('x', 1, -2, 2))
  const [showAnchor, setShowAnchor] = useState(() => initialBoolean('anchor', true))
  const [showAsymptote, setShowAsymptote] = useState(() => initialBoolean('asymptote', true))
  const [showTable, setShowTable] = useState(() => initialBoolean('table', true))

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (isEditableTarget(event.target) || (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight')) return
      setVariant((current) => {
        const direction = event.key === 'ArrowRight' ? 1 : -1
        const index = (variants.indexOf(current) + direction + variants.length) % variants.length
        return variants[index]
      })
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    const url = new URL(window.location.href)
    url.searchParams.set('variant', variant)
    url.searchParams.set('base', String(Number(base.toFixed(3))))
    url.searchParams.set('x', String(selectedX))
    url.searchParams.set('anchor', showAnchor ? '1' : '0')
    url.searchParams.set('asymptote', showAsymptote ? '1' : '0')
    url.searchParams.set('table', showTable ? '1' : '0')
    window.history.replaceState({}, '', url)
  }, [variant, base, selectedX, showAnchor, showAsymptote, showTable])

  const state: AnimationState = useMemo(
    () => ({ base, selectedX, showAnchor, showAsymptote, showTable }),
    [base, selectedX, showAnchor, showAsymptote, showTable],
  )
  const actions: AnimationActions = { setBase, setSelectedX, setShowAnchor, setShowAsymptote, setShowTable }

  return (
    <>
      {variant === 'A' && <VariantA state={state} actions={actions} />}
      {variant === 'B' && <VariantB state={state} actions={actions} />}
      {variant === 'C' && <VariantC state={state} actions={actions} />}
      {import.meta.env.DEV && <PrototypeSwitcher variant={variant} onChange={setVariant} />}
    </>
  )
}
