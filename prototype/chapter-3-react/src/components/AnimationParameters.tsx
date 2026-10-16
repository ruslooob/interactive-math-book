import { describeBase, exponentialValue, formatNumber } from '../lib/exponential'

export type AnimationState = {
  base: number
  selectedX: number
  showAnchor: boolean
  showAsymptote: boolean
  showTable: boolean
}

export type AnimationActions = {
  setBase: (value: number) => void
  setSelectedX: (value: number) => void
  setShowAnchor: (value: boolean) => void
  setShowAsymptote: (value: boolean) => void
  setShowTable: (value: boolean) => void
}

type AnimationParametersProps = {
  state: AnimationState
  actions: AnimationActions
}

const presets = [
  { value: 0.5, label: '0,5' },
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: Math.E, label: 'e' },
]

function Toggle({ checked, label, onChange }: { checked: boolean; label: string; onChange: (value: boolean) => void }) {
  return (
    <label className="parameter-toggle">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <span aria-hidden="true" />
      {label}
    </label>
  )
}

export function AnimationParameters({ state, actions }: AnimationParametersProps) {
  const description = describeBase(state.base)

  return (
    <aside className="parameters-panel">
      <header>
        <span className="content-label">Параметры анимации</span>
        <h2>Измените и сравните</h2>
      </header>

      <div className="parameter-control">
        <div className="parameter-control__label">
          <label htmlFor="base">Основание a</label>
          <output htmlFor="base">{formatNumber(state.base)}</output>
        </div>
        <input id="base" type="range" min="0.2" max="4" step="0.05" value={state.base} onChange={(event) => actions.setBase(Number(event.target.value))} />
        <div className="preset-buttons" aria-label="Примеры оснований">
          {presets.map((preset) => (
            <button
              className={Math.abs(state.base - preset.value) < 0.01 ? 'is-active' : ''}
              key={preset.label}
              type="button"
              onClick={() => actions.setBase(preset.value)}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <div className="parameter-control">
        <div className="parameter-control__label">
          <label htmlFor="selected-x">Аргумент отмеченной точки x</label>
          <output htmlFor="selected-x">{formatNumber(state.selectedX)}</output>
        </div>
        <input id="selected-x" type="range" min="-2" max="2" step="0.25" value={state.selectedX} onChange={(event) => actions.setSelectedX(Number(event.target.value))} />
      </div>

      <div className="current-result">
        <span>Текущее значение</span>
        <strong>{formatNumber(state.base)}<sup>{formatNumber(state.selectedX)}</sup> = {formatNumber(exponentialValue(state.base, state.selectedX))}</strong>
        <p>{description.title}</p>
      </div>

      <fieldset className="display-controls">
        <legend>Подсказки на анимации</legend>
        <Toggle checked={state.showAnchor} label="Точка (0; 1)" onChange={actions.setShowAnchor} />
        <Toggle checked={state.showAsymptote} label="Асимптота y = 0" onChange={actions.setShowAsymptote} />
        <Toggle checked={state.showTable} label="Таблица значений" onChange={actions.setShowTable} />
      </fieldset>
    </aside>
  )
}
