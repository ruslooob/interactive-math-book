import { useState } from 'react'
import { exponentialValue, formatNumber } from '../lib/exponential'
import { Formula } from './Formula'

export type AnimationState = {
  base: number
}

export type AnimationActions = {
  setBase: (value: number) => void
}

const presets = [
  { value: 0.5, label: '0,5' },
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: Math.E, label: 'e' },
]

export function AnimationParameters({ state, actions }: { state: AnimationState; actions: AnimationActions }) {
  const [argument, setArgument] = useState('1')
  const parsedArgument = Number(argument.replace(',', '.'))
  const hasArgument = argument.trim() !== '' && Number.isFinite(parsedArgument)
  const tableX = [-2, -1, 0, 1, 2]

  return (
    <aside className="parameters-panel">
      <header>
        <span className="content-label">Параметры анимации</span>
        <h2>Основание функции</h2>
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

      <div className="interactive-table">
        <h3>Таблица значений</h3>
        <table>
          <tbody>
            <tr>
              <th scope="row">x</th>
              {tableX.map((x) => <td key={`x-${x}`}>{x}</td>)}
            </tr>
            <tr>
              <th scope="row">y</th>
              {tableX.map((x) => <td key={`y-${x}`}>{formatNumber(exponentialValue(state.base, x), 2)}</td>)}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="value-calculator">
        <label htmlFor="argument">Вычислить значение при x</label>
        <input
          id="argument"
          type="text"
          inputMode="decimal"
          value={argument}
          onChange={(event) => setArgument(event.target.value)}
          aria-describedby="calculated-value"
        />
        <output id="calculated-value" htmlFor="argument">
          {hasArgument ? (
            <><Formula>{`${formatNumber(state.base)}^{${formatNumber(parsedArgument)}}`}</Formula> = {formatNumber(exponentialValue(state.base, parsedArgument))}</>
          ) : 'Введите число'}
        </output>
      </div>
    </aside>
  )
}
