import { useEffect, useMemo, useRef, useState } from 'react'
import { describeBase, exponentialValue, formatNumber } from '../lib/exponential'
import { Formula } from './Formula'

type ExponentialGraphProps = {
  base: number
  selectedX: number
  showAnchor: boolean
  showAsymptote: boolean
  showTable: boolean
}

const width = 760
const height = 430
const frame = { left: 66, right: 28, top: 30, bottom: 58 }
const plotWidth = width - frame.left - frame.right
const plotHeight = height - frame.top - frame.bottom
const xMin = -3
const xMax = 3

function useAnimatedNumber(target: number) {
  const [value, setValue] = useState(target)
  const current = useRef(target)

  useEffect(() => {
    const from = current.current
    const startedAt = performance.now()
    let animationFrame = 0

    const update = (now: number) => {
      const progress = Math.min((now - startedAt) / 280, 1)
      const eased = 1 - (1 - progress) ** 3
      const next = from + (target - from) * eased
      current.current = next
      setValue(next)
      if (progress < 1) animationFrame = requestAnimationFrame(update)
    }

    animationFrame = requestAnimationFrame(update)
    return () => cancelAnimationFrame(animationFrame)
  }, [target])

  return value
}

export function ExponentialGraph(props: ExponentialGraphProps) {
  const animatedBase = useAnimatedNumber(props.base)
  const animatedX = useAnimatedNumber(props.selectedX)
  const yMax = Math.max(5, exponentialValue(animatedBase, 2.55), exponentialValue(animatedBase, -2.55)) * 1.06
  const mapX = (x: number) => frame.left + ((x - xMin) / (xMax - xMin)) * plotWidth
  const mapY = (y: number) => frame.top + plotHeight - (y / yMax) * plotHeight

  const path = useMemo(() => {
    const points: string[] = []
    for (let index = 0; index <= 180; index += 1) {
      const x = xMin + ((xMax - xMin) * index) / 180
      const y = exponentialValue(animatedBase, x)
      points.push(`${index === 0 ? 'M' : 'L'} ${mapX(x).toFixed(2)} ${mapY(y).toFixed(2)}`)
    }
    return points.join(' ')
  }, [animatedBase, yMax])

  const pointY = exponentialValue(animatedBase, animatedX)
  const state = describeBase(props.base)
  const xTicks = [-3, -2, -1, 0, 1, 2, 3]
  const yTicks = [0, 0.25, 0.5, 0.75, 1]
  const tableX = [-2, -1, 0, 1, 2]

  return (
    <section className="graph-card" aria-label="График показательной функции">
      <header className="graph-card__header">
        <div>
          <span className="content-label">Интерактивная анимация</span>
          <h2><Formula>{`y=${formatNumber(props.base)}^x`}</Formula></h2>
        </div>
        <div className={`base-state base-state--${state.tone}`}>
          <strong>{state.title}</strong>
          <span>{state.detail}</span>
        </div>
      </header>

      <svg className="graph" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`График функции при основании ${formatNumber(props.base)}`}>
        <defs>
          <clipPath id="plot-area">
            <rect x={frame.left} y={frame.top} width={plotWidth} height={plotHeight} />
          </clipPath>
        </defs>

        <g className="graph-grid">
          {xTicks.map((tick) => <line key={`x-${tick}`} x1={mapX(tick)} x2={mapX(tick)} y1={frame.top} y2={frame.top + plotHeight} />)}
          {yTicks.map((part) => <line key={`y-${part}`} x1={frame.left} x2={frame.left + plotWidth} y1={mapY(yMax * part)} y2={mapY(yMax * part)} />)}
        </g>

        {props.showAsymptote && (
          <g className="asymptote">
            <line x1={frame.left} x2={frame.left + plotWidth} y1={mapY(0)} y2={mapY(0)} />
            <text x={frame.left + 10} y={mapY(0) - 10}>асимптота y = 0</text>
          </g>
        )}

        <g className="axes">
          <line x1={frame.left} x2={frame.left + plotWidth + 9} y1={mapY(0)} y2={mapY(0)} />
          <line x1={mapX(0)} x2={mapX(0)} y1={frame.top} y2={frame.top + plotHeight + 9} />
          <text x={frame.left + plotWidth + 13} y={mapY(0) + 5}>x</text>
          <text x={mapX(0) + 9} y={frame.top + 3}>y</text>
        </g>

        <g className="tick-labels">
          {xTicks.filter((tick) => tick !== 0).map((tick) => <text key={tick} x={mapX(tick)} y={mapY(0) + 23}>{tick}</text>)}
          <text x={mapX(0) - 13} y={mapY(0) + 22}>0</text>
          <text x={mapX(0) - 25} y={mapY(1) + 4}>1</text>
        </g>

        <g clipPath="url(#plot-area)">
          <path className="exponential-curve" d={path} />
          <line className="point-guide" x1={mapX(animatedX)} x2={mapX(animatedX)} y1={mapY(0)} y2={mapY(pointY)} />
          <circle className="selected-point" cx={mapX(animatedX)} cy={mapY(pointY)} r="7" />
          {props.showAnchor && <circle className="anchor-point" cx={mapX(0)} cy={mapY(1)} r="6" />}
        </g>

        {props.showAnchor && <text className="point-label" x={mapX(0) + 11} y={mapY(1) - 9}>(0; 1)</text>}
        <g className="selected-label" transform={`translate(${Math.min(mapX(animatedX) + 12, width - 145)} ${Math.max(mapY(pointY) - 36, 15)})`}>
          <rect width="128" height="28" rx="7" />
          <text x="10" y="19">({formatNumber(props.selectedX)}; {formatNumber(exponentialValue(props.base, props.selectedX))})</text>
        </g>
      </svg>

      {props.showTable && (
        <div className="value-table" aria-label="Таблица значений">
          <div className="value-table__head">x</div>
          {tableX.map((x) => <div key={`x-${x}`}>{x}</div>)}
          <div className="value-table__head">y</div>
          {tableX.map((x) => <div key={`y-${x}`}>{formatNumber(exponentialValue(props.base, x), 2)}</div>)}
        </div>
      )}

      <footer className="graph-readout">
        <span>Точка на графике</span>
        <strong>x = {formatNumber(props.selectedX)}</strong>
        <i aria-hidden="true">→</i>
        <strong>y = {formatNumber(exponentialValue(props.base, props.selectedX))}</strong>
      </footer>
    </section>
  )
}
