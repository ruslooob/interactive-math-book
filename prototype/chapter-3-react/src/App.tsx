import { useEffect, useMemo, useState } from 'react'
import type { SectionId } from './content/chapter'
import { VariantA, VariantB, VariantC, type SceneActions, type SceneState } from './components/Variants'

type VariantId = 'A' | 'B' | 'C'
const variants: VariantId[] = ['A', 'B', 'C']

function getVariant(): VariantId {
  const value = new URLSearchParams(window.location.search).get('variant')?.toUpperCase()
  return value === 'B' || value === 'C' ? value : 'A'
}

function getInitialSection(): SectionId {
  const value = Number(new URLSearchParams(window.location.search).get('section'))
  return value >= 11 && value <= 19 ? value as SectionId : 11
}

function getInitialBase() {
  const value = Number(new URLSearchParams(window.location.search).get('base'))
  return value >= 0.25 && value <= 4 ? value : 2
}

export function App() {
  const [variant, setVariant] = useState<VariantId>(getVariant)
  const [sectionId, setSectionId] = useState<SectionId>(getInitialSection)
  const [base, setBase] = useState(getInitialBase)
  const [probeX, setProbeX] = useState(1)
  const [target, setTarget] = useState(4)
  const [showExp, setShowExp] = useState(true)
  const [showLog, setShowLog] = useState(true)
  const [showMirror, setShowMirror] = useState(true)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
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
    window.history.replaceState({}, '', url)
  }, [variant])

  const state: SceneState = useMemo(() => ({ sectionId, base, probeX, target, showExp, showLog, showMirror }), [sectionId, base, probeX, target, showExp, showLog, showMirror])
  const actions: SceneActions = { setSectionId, setBase, setProbeX, setTarget, setShowExp, setShowLog, setShowMirror }

  return (
    <>
      {variant === 'A' && <VariantA state={state} actions={actions} />}
      {variant === 'B' && <VariantB state={state} actions={actions} />}
      {variant === 'C' && <VariantC state={state} actions={actions} />}
      {import.meta.env.DEV && (
        <div className="variant-switcher" aria-label="Переключатель композиций">
          <span>Композиция</span>
          {variants.map((item) => <button className={variant === item ? 'is-active' : ''} key={item} type="button" onClick={() => setVariant(item)}>{item}</button>)}
        </div>
      )}
    </>
  )
}
