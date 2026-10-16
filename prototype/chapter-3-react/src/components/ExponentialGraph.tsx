import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { describeBase, exponentialValue, formatNumber } from '../lib/exponential'
import { Formula } from './Formula'

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

export function ExponentialGraph({ base }: { base: number }) {
  const svgRef = useRef<SVGSVGElement>(null)
  const animatedBase = useAnimatedNumber(base)
  const [hoverX, setHoverX] = useState<number | null>(null)
  const yMax = Math.max(4, exponentialValue(animatedBase, xMax), exponentialValue(animatedBase, xMin)) * 1.08
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

  const state = describeBase(base)
  const xTicks = [-3, -2, -1, 0, 1, 2, 3]
  const yTicks = [0, 0.25, 0.5, 0.75, 1]
  const hoverY = hoverX === null ? null : exponentialValue(base, hoverX)

  const inspectPoint = (event: ReactPointerEvent<SVGSVGElement>) => {
    const bounds = svgRef.current?.getBoundingClientRect()
    if (!bounds) return
    const svgX = ((event.clientX - bounds.left) / bounds.width) * width
    const x = xMin + ((svgX - frame.left) / plotWidth) * (xMax - xMin)
    if (x < xMin || x > xMax) {
      setHoverX(null)
      return
    }
    setHoverX(Number(x.toFixed(2)))
  }

  return (
    <section className="graph-card" aria-label="Интерактивный график показательной функции">
      <header className="graph-card__header">
        <div>
          <span className="content-label">Интерактивная анимация</span>
          <h2><Formula>{`y=${formatNumber(base)}^x`}</Formula></h2>
        </div>
        <div className={`base-state base-state--${state.tone}`}>
          <strong>{state.title}</strong>
        </div>
      </header>

      <svg
        ref={svgRef}
        className="graph"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={`График функции при основании ${formatNumber(base)}`}
        onPointerMove={inspectPoint}
        onPointerDown={inspectPoint}
        onPointerLeave={() => setHoverX(null)}
      >
        <g className="graph-grid">
          {xTicks.map((tick) => <line key={`x-${tick}`} x1={mapX(tick)} x2={mapX(tick)} y1={frame.top} y2={frame.top + plotHeight} />)}
          {yTicks.map((part) => <line key={`y-${part}`} x1={frame.left} x2={frame.left + plotWidth} y1={mapY(yMax * part)} y2={mapY(yMax * part)} />)}
        </g>

        <g className="asymptote">
          <line x1={frame.left} x2={frame.left + plotWidth} y1={mapY(0)} y2={mapY(0)} />
          <text x={frame.left + 10} y={mapY(0) - 10}>y = 0</text>
        </g>

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

        <path className="exponential-curve" d={path} />
        <circle className="anchor-point" cx={mapX(0)} cy={mapY(1)} r="6" />
        <text className="point-label" x={mapX(0) + 11} y={mapY(1) - 9}>(0; 1)</text>

        {hoverX !== null && hoverY !== null && (
          <g className="hover-point">
            <line x1={mapX(hoverX)} x2={mapX(hoverX)} y1={mapY(0)} y2={mapY(hoverY)} />
            <circle cx={mapX(hoverX)} cy={mapY(hoverY)} r="7" />
            <g transform={`translate(${hoverX > 1.35 ? mapX(hoverX) - 142 : mapX(hoverX) + 12} ${Math.max(mapY(hoverY) - 37, 11)})`}>
              <rect width="130" height="29" rx="7" />
              <text x="10" y="19">({formatNumber(hoverX)}; {formatNumber(hoverY)})</text>
            </g>
          </g>
        )}
      </svg>

      <footer className="graph-readout" aria-live="polite">
        {hoverX === null || hoverY === null ? (
          <span>Наведите указатель на график, чтобы увидеть координаты точки</span>
        ) : (
          <>
            <span>Точка на графике</span>
            <strong>x = {formatNumber(hoverX)}</strong>
            <i aria-hidden="true">→</i>
            <strong>y = {formatNumber(hoverY)}</strong>
          </>
        )}
      </footer>
    </section>
  )
}
