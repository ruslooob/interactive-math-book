import { baseLabel, isValidBase, monotonicity } from '../lib/math'

type ControlDeckProps = {
  base: number
  probeX: number
  target: number
  showExp: boolean
  showLog: boolean
  showMirror: boolean
  onBase: (value: number) => void
  onProbeX: (value: number) => void
  onTarget: (value: number) => void
  onShowExp: (value: boolean) => void
  onShowLog: (value: boolean) => void
  onShowMirror: (value: boolean) => void
  compact?: boolean
}

const presets = [0.5, 1, Math.E, 2]

export function ControlDeck({
  base,
  probeX,
  target,
  showExp,
  showLog,
  showMirror,
  onBase,
  onProbeX,
  onTarget,
  onShowExp,
  onShowLog,
  onShowMirror,
  compact = false,
}: ControlDeckProps) {
  const valid = isValidBase(base)

  return (
    <section className={`control-deck${compact ? ' control-deck--compact' : ''}`}>
      <div className="panel-title">
        <span className="eyebrow">Пульт модели</span>
        <span className={`status${valid ? '' : ' status--warning'}`}>{valid ? monotonicity(base) : 'запрещённая база'}</span>
      </div>

      <div className="control-block control-block--base">
        <div className="control-label">
          <label htmlFor="base-range">Основание a</label>
          <output>{baseLabel(base)}</output>
        </div>
        <input
          id="base-range"
          type="range"
          min="0.25"
          max="4"
          step="0.01"
          value={base}
          onChange={(event) => {
            const next = Number(event.target.value)
            onBase(Math.abs(next - 1) < 0.025 ? 1 : next)
          }}
        />
        <div className="preset-row">
          {presets.map((preset) => (
            <button className={Math.abs(base - preset) < 0.02 ? 'is-active' : ''} key={preset} type="button" onClick={() => onBase(preset)}>
              {preset === Math.E ? 'e' : String(preset).replace('.', ',')}
            </button>
          ))}
        </div>
      </div>

      <div className="control-pair">
        <label>
          <span>Точка x</span>
          <output>{probeX.toFixed(1).replace('.', ',')}</output>
          <input type="range" min="-2" max="2" step="0.1" value={probeX} onChange={(event) => onProbeX(Number(event.target.value))} />
        </label>
        <label>
          <span>Уровень c</span>
          <output>{target.toFixed(1).replace('.', ',')}</output>
          <input type="range" min="0.3" max="6" step="0.1" value={target} onChange={(event) => onTarget(Number(event.target.value))} />
        </label>
      </div>

      <div className="toggle-row" aria-label="Слои графика">
        <Toggle checked={showExp} label="aˣ" tone="exp" onChange={onShowExp} />
        <Toggle checked={showLog} label="logₐx" tone="log" onChange={onShowLog} />
        <Toggle checked={showMirror} label="y = x" tone="mirror" onChange={onShowMirror} />
      </div>
    </section>
  )
}

function Toggle({ checked, label, tone, onChange }: { checked: boolean; label: string; tone: string; onChange: (value: boolean) => void }) {
  return (
    <label className={`toggle toggle--${tone}${checked ? ' is-on' : ''}`}>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <i />
      <span>{label}</span>
    </label>
  )
}
