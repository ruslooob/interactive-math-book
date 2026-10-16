import { useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { exponentialValue, formatNumber } from '../lib/exponential'
import { Formula } from './Formula'

const width = 760
const height = 420
const frame = { left: 66, right: 28, top: 30, bottom: 58 }
const plotWidth = width - frame.left - frame.right
const plotHeight = height - frame.top - frame.bottom

function safeBase(value: number, previous: number) {
  if (Math.abs(value - 1) >= 0.04) return value
  return previous < 1 ? 0.95 : 1.05
}

function BaseControl({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  return (
    <div className="parameter-control">
      <div className="parameter-control__label">
        <label htmlFor="concept-base">Основание a</label>
        <output htmlFor="concept-base">{formatNumber(value)}</output>
      </div>
      <input id="concept-base" type="range" min="0.2" max="4" step="0.05" value={value} onChange={(event) => onChange(safeBase(Number(event.target.value), value))} />
      <div className="preset-buttons preset-buttons--three">
        {[0.5, 2, 3].map((preset) => <button className={value === preset ? 'is-active' : ''} key={preset} type="button" onClick={() => onChange(preset)}>{formatNumber(preset)}</button>)}
      </div>
    </div>
  )
}

function Slider({ id, label, value, min, max, step = 1, onChange }: { id: string; label: string; value: number; min: number; max: number; step?: number; onChange: (value: number) => void }) {
  return (
    <div className="parameter-control compact-control">
      <div className="parameter-control__label">
        <label htmlFor={id}>{label}</label>
        <output htmlFor={id}>{formatNumber(value)}</output>
      </div>
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} />
    </div>
  )
}

function ComparisonGraph({ family, mode, base, level }: { family: 'exponential' | 'logarithmic'; mode: 'equation' | 'inequality'; base: number; level: number }) {
  const isExponential = family === 'exponential'
  const xMin = isExponential ? -3 : 0
  const xMax = isExponential ? 3 : 8
  const solution = isExponential ? level : exponentialValue(base, level)
  const horizontalValue = isExponential ? exponentialValue(base, level) : level
  const yMin = isExponential ? 0 : -4
  const yMax = isExponential ? Math.max(5, exponentialValue(base, -3), exponentialValue(base, 3), horizontalValue) * 1.08 : 4
  const mapX = (x: number) => frame.left + ((x - xMin) / (xMax - xMin)) * plotWidth
  const mapY = (y: number) => frame.top + ((yMax - y) / (yMax - yMin)) * plotHeight
  const functionValue = (x: number) => isExponential ? exponentialValue(base, x) : Math.log(x) / Math.log(base)

  const path = useMemo(() => {
    const points: string[] = []
    for (let index = 0; index <= 220; index += 1) {
      const x = isExponential
        ? xMin + ((xMax - xMin) * index) / 220
        : 0.04 + ((xMax - 0.04) * index) / 220
      const y = functionValue(x)
      const prefix = points.length === 0 ? 'M' : 'L'
      points.push(`${prefix} ${mapX(x).toFixed(2)} ${mapY(Math.max(yMin - 2, Math.min(yMax + 2, y))).toFixed(2)}`)
    }
    return points.join(' ')
  }, [base, family, yMax])

  const relationKeepsDirection = base > 1
  const solutionSide = relationKeepsDirection ? 'right' : 'left'
  const clippedSolution = Math.max(xMin, Math.min(xMax, solution))
  const highlightStart = solutionSide === 'right' ? clippedSolution : xMin
  const highlightEnd = solutionSide === 'right' ? xMax : clippedSolution
  const formula = isExponential
    ? mode === 'equation' ? `a^x=a^{${formatNumber(level)}}` : `a^x>a^{${formatNumber(level)}}`
    : mode === 'equation' ? `\\log_a x=${formatNumber(level)}` : `\\log_a x>${formatNumber(level)}`

  return (
    <section className="graph-card">
      <header className="graph-card__header">
        <div><span className="content-label">Интерактивная анимация</span><h2><Formula>{formula}</Formula></h2></div>
        <div className="base-state"><strong>{mode === 'equation' ? `Решение: x = ${formatNumber(solution)}` : `Граница: x = ${formatNumber(solution)}`}</strong></div>
      </header>
      <svg className="graph" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Графическое решение">
        <g className="graph-grid">
          {[0, 0.25, 0.5, 0.75, 1].map((part) => <line key={`x-${part}`} x1={frame.left + plotWidth * part} x2={frame.left + plotWidth * part} y1={frame.top} y2={frame.top + plotHeight} />)}
          {[0, 0.25, 0.5, 0.75, 1].map((part) => <line key={`y-${part}`} x1={frame.left} x2={frame.left + plotWidth} y1={frame.top + plotHeight * part} y2={frame.top + plotHeight * part} />)}
        </g>
        <g className="axes">
          <line x1={frame.left} x2={frame.left + plotWidth + 9} y1={mapY(0)} y2={mapY(0)} />
          <line x1={mapX(0)} x2={mapX(0)} y1={frame.top} y2={frame.top + plotHeight + 9} />
          <text x={frame.left + plotWidth + 13} y={mapY(0) + 5}>x</text>
          <text x={mapX(0) + 9} y={frame.top + 3}>y</text>
        </g>
        {mode === 'inequality' && <line className="solution-range" x1={mapX(highlightStart)} x2={mapX(highlightEnd)} y1={mapY(0)} y2={mapY(0)} />}
        <line className="comparison-line" x1={frame.left} x2={frame.left + plotWidth} y1={mapY(horizontalValue)} y2={mapY(horizontalValue)} />
        <path className="exponential-curve" d={path} />
        {solution >= xMin && solution <= xMax && horizontalValue >= yMin && horizontalValue <= yMax && <circle className="anchor-point" cx={mapX(solution)} cy={mapY(horizontalValue)} r="7" />}
        {family === 'logarithmic' && <line className="vertical-asymptote" x1={mapX(0)} x2={mapX(0)} y1={frame.top} y2={frame.top + plotHeight} />}
      </svg>
      <footer className="graph-readout">
        <span>{mode === 'equation' ? 'Точка пересечения даёт решение' : 'Выделенная часть оси — решения'}</span>
        <strong>{base > 1 ? 'a > 1: знак сохраняется' : '0 < a < 1: знак меняется'}</strong>
      </footer>
    </section>
  )
}

export function ComparisonAnimation({ family, mode }: { family: 'exponential' | 'logarithmic'; mode: 'equation' | 'inequality' }) {
  const [base, setBase] = useState(2)
  const [level, setLevel] = useState(mode === 'equation' ? 2 : 1)
  const result = family === 'exponential' ? level : exponentialValue(base, level)
  return (
    <div className="animation-unit">
      <ComparisonGraph family={family} mode={mode} base={base} level={level} />
      <aside className="parameters-panel">
        <header><span className="content-label">Параметры анимации</span><h2>{mode === 'equation' ? 'Точка пересечения' : 'Граница решений'}</h2></header>
        <BaseControl value={base} onChange={setBase} />
        <Slider id="comparison-level" label={family === 'exponential' ? 'Показатель k' : 'Значение c'} value={level} min={-2} max={2} step={0.25} onChange={setLevel} />
        <div className="animation-result">
          <span>{mode === 'equation' ? 'Решение' : 'Граница'}</span>
          <Formula>{`x=${formatNumber(result)}`}</Formula>
          {mode === 'inequality' && <strong>{base > 1 ? 'решения справа' : 'решения слева'}</strong>}
        </div>
      </aside>
    </div>
  )
}

export function LogarithmDefinitionAnimation() {
  const [base, setBase] = useState(2)
  const [exponent, setExponent] = useState(3)
  const value = exponentialValue(base, exponent)
  return (
    <div className="animation-unit">
      <section className="concept-card logarithm-converter">
        <header><span className="content-label">Интерактивная анимация</span><h2>Две записи одного равенства</h2></header>
        <div className="conversion-equations">
          <div><span>Степенная запись</span><Formula display>{`${formatNumber(base)}^{${formatNumber(exponent)}}=${formatNumber(value)}`}</Formula></div>
          <i aria-hidden="true">⇄</i>
          <div><span>Логарифмическая запись</span><Formula display>{`\\log_{${formatNumber(base)}}${formatNumber(value)}=${formatNumber(exponent)}`}</Formula></div>
        </div>
        <p>Основание остаётся основанием, результат степени становится аргументом, показатель становится значением логарифма.</p>
      </section>
      <aside className="parameters-panel">
        <header><span className="content-label">Параметры анимации</span><h2>Основание и показатель</h2></header>
        <BaseControl value={base} onChange={setBase} />
        <Slider id="log-exponent" label="Показатель c" value={exponent} min={-3} max={4} step={0.5} onChange={setExponent} />
        <div className="animation-result"><span>Число b</span><strong>{formatNumber(value)}</strong></div>
      </aside>
    </div>
  )
}

export function LogarithmicFunctionAnimation() {
  const [base, setBase] = useState(2)
  const [hoverX, setHoverX] = useState<number | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const xMin = 0
  const xMax = 8
  const yMin = -4
  const yMax = 4
  const mapX = (x: number) => frame.left + (x / xMax) * plotWidth
  const mapY = (y: number) => frame.top + ((yMax - y) / (yMax - yMin)) * plotHeight
  const path = useMemo(() => {
    const points: string[] = []
    for (let index = 0; index <= 240; index += 1) {
      const x = 0.04 + ((xMax - 0.04) * index) / 240
      const y = Math.log(x) / Math.log(base)
      points.push(`${index === 0 ? 'M' : 'L'} ${mapX(x).toFixed(2)} ${mapY(Math.max(yMin - 1, Math.min(yMax + 1, y))).toFixed(2)}`)
    }
    return points.join(' ')
  }, [base])
  const hoverY = hoverX === null ? null : Math.log(hoverX) / Math.log(base)
  const inspectPoint = (event: ReactPointerEvent<SVGSVGElement>) => {
    const bounds = svgRef.current?.getBoundingClientRect()
    if (!bounds) return
    const svgX = ((event.clientX - bounds.left) / bounds.width) * width
    const x = ((svgX - frame.left) / plotWidth) * xMax
    setHoverX(x > 0 && x <= xMax ? Number(x.toFixed(2)) : null)
  }
  return (
    <div className="animation-unit">
      <section className="graph-card">
        <header className="graph-card__header"><div><span className="content-label">Интерактивная анимация</span><h2><Formula>{`y=\\log_{${formatNumber(base)}}x`}</Formula></h2></div><div className="base-state"><strong>{base > 1 ? 'Функция возрастает' : 'Функция убывает'}</strong></div></header>
        <svg ref={svgRef} className="graph" viewBox={`0 0 ${width} ${height}`} onPointerMove={inspectPoint} onPointerLeave={() => setHoverX(null)}>
          <g className="graph-grid">{[0, .25, .5, .75, 1].map((part) => <line key={part} x1={frame.left + plotWidth * part} x2={frame.left + plotWidth * part} y1={frame.top} y2={frame.top + plotHeight} />)}</g>
          <g className="axes"><line x1={frame.left} x2={frame.left + plotWidth + 9} y1={mapY(0)} y2={mapY(0)} /><line x1={mapX(0)} x2={mapX(0)} y1={frame.top} y2={frame.top + plotHeight} /><text x={frame.left + plotWidth + 13} y={mapY(0) + 5}>x</text><text x={mapX(0) + 9} y={frame.top + 3}>y</text></g>
          <line className="vertical-asymptote" x1={mapX(0)} x2={mapX(0)} y1={frame.top} y2={frame.top + plotHeight} />
          <path className="exponential-curve" d={path} />
          <circle className="anchor-point" cx={mapX(1)} cy={mapY(0)} r="6" />
          {hoverX !== null && hoverY !== null && hoverY >= yMin && hoverY <= yMax && <g className="hover-point"><circle cx={mapX(hoverX)} cy={mapY(hoverY)} r="7" /><g transform={`translate(${Math.min(mapX(hoverX) + 12, width - 150)} ${Math.max(mapY(hoverY) - 38, 10)})`}><rect width="138" height="29" rx="7" /><text x="10" y="19">({formatNumber(hoverX)}; {formatNumber(hoverY)})</text></g></g>}
        </svg>
        <footer className="graph-readout"><span>{hoverX === null ? 'Наведите указатель на график' : 'Точка на графике'}</span>{hoverX !== null && hoverY !== null && <strong>x = {formatNumber(hoverX)} → y = {formatNumber(hoverY)}</strong>}</footer>
      </section>
      <aside className="parameters-panel"><header><span className="content-label">Параметры анимации</span><h2>Основание функции</h2></header><BaseControl value={base} onChange={setBase} /><div className="animation-result"><span>Точка для всех оснований</span><Formula>{'(1;0)'}</Formula></div></aside>
    </div>
  )
}

type LogRule = 'product' | 'quotient' | 'power'

export function LogarithmPropertiesAnimation() {
  const [base, setBase] = useState(2)
  const [x, setX] = useState(4)
  const [y, setY] = useState(2)
  const [power, setPower] = useState(2)
  const [rule, setRule] = useState<LogRule>('product')
  const log = (value: number) => Math.log(value) / Math.log(base)
  const formulas = {
    product: { left: `\\log_{${formatNumber(base)}}(${formatNumber(x)}\\cdot${formatNumber(y)})`, right: `\\log_{${formatNumber(base)}}${formatNumber(x)}+\\log_{${formatNumber(base)}}${formatNumber(y)}`, value: log(x * y) },
    quotient: { left: `\\log_{${formatNumber(base)}}\\frac{${formatNumber(x)}}{${formatNumber(y)}}`, right: `\\log_{${formatNumber(base)}}${formatNumber(x)}-\\log_{${formatNumber(base)}}${formatNumber(y)}`, value: log(x / y) },
    power: { left: `\\log_{${formatNumber(base)}}(${formatNumber(x)}^{${formatNumber(power)}})`, right: `${formatNumber(power)}\\log_{${formatNumber(base)}}${formatNumber(x)}`, value: log(x ** power) },
  }
  const current = formulas[rule]
  return (
    <div className="animation-unit">
      <section className="concept-card rule-checker">
        <header><span className="content-label">Интерактивная анимация</span><h2>Проверка свойств числами</h2></header>
        <div className="rule-tabs">
          {([['product', 'Произведение'], ['quotient', 'Частное'], ['power', 'Степень']] as const).map(([id, label]) => <button className={rule === id ? 'is-active' : ''} type="button" key={id} onClick={() => setRule(id)}>{label}</button>)}
        </div>
        <div className="rule-equation"><Formula display>{current.left}</Formula><i>=</i><Formula display>{current.right}</Formula></div>
        <div className="equality-check"><span>Обе части равны</span><strong>{formatNumber(current.value)}</strong></div>
      </section>
      <aside className="parameters-panel">
        <header><span className="content-label">Параметры анимации</span><h2>Положительные числа</h2></header>
        <BaseControl value={base} onChange={setBase} />
        <Slider id="rule-x" label="Число x" value={x} min={0.5} max={8} step={0.5} onChange={setX} />
        {rule !== 'power' && <Slider id="rule-y" label="Число y" value={y} min={0.5} max={8} step={0.5} onChange={setY} />}
        {rule === 'power' && <Slider id="rule-power" label="Степень r" value={power} min={-3} max={4} step={1} onChange={setPower} />}
      </aside>
    </div>
  )
}

type DerivativeFunction = 'exp' | 'general-exp' | 'ln' | 'log'

export function DerivativeAnimation() {
  const [kind, setKind] = useState<DerivativeFunction>('exp')
  const [base, setBase] = useState(2)
  const [point, setPoint] = useState(1)
  const isLog = kind === 'ln' || kind === 'log'
  const effectiveBase = kind === 'exp' || kind === 'ln' ? Math.E : base
  const xMin = isLog ? 0 : -2.5
  const xMax = isLog ? 6 : 2.5
  const yMin = isLog ? -3 : 0
  const yMax = isLog ? 4 : Math.max(6, effectiveBase ** 2.5)
  const mapX = (x: number) => frame.left + ((x - xMin) / (xMax - xMin)) * plotWidth
  const mapY = (y: number) => frame.top + ((yMax - y) / (yMax - yMin)) * plotHeight
  const fn = (x: number) => isLog ? Math.log(x) / Math.log(effectiveBase) : effectiveBase ** x
  const derivative = (x: number) => isLog ? 1 / (x * Math.log(effectiveBase)) : effectiveBase ** x * Math.log(effectiveBase)
  const safePoint = isLog ? Math.max(0.25, point) : point
  const pointY = fn(safePoint)
  const slope = derivative(safePoint)
  const path = useMemo(() => {
    const points: string[] = []
    for (let index = 0; index <= 220; index += 1) {
      const x = isLog ? 0.04 + ((xMax - 0.04) * index) / 220 : xMin + ((xMax - xMin) * index) / 220
      points.push(`${index === 0 ? 'M' : 'L'} ${mapX(x).toFixed(2)} ${mapY(Math.max(yMin - 2, Math.min(yMax + 2, fn(x)))).toFixed(2)}`)
    }
    return points.join(' ')
  }, [kind, base])
  const tangentY = (x: number) => pointY + slope * (x - safePoint)
  const labels: Record<DerivativeFunction, string> = { exp: 'eˣ', 'general-exp': 'aˣ', ln: 'ln x', log: 'logₐx' }
  return (
    <div className="animation-unit">
      <section className="graph-card">
        <header className="graph-card__header"><div><span className="content-label">Интерактивная анимация</span><h2>Касательная к <span>{labels[kind]}</span></h2></div><div className="base-state"><strong>Наклон: {formatNumber(slope)}</strong></div></header>
        <svg className="graph" viewBox={`0 0 ${width} ${height}`}>
          <g className="graph-grid">{[0, .25, .5, .75, 1].map((part) => <line key={part} x1={frame.left + plotWidth * part} x2={frame.left + plotWidth * part} y1={frame.top} y2={frame.top + plotHeight} />)}</g>
          <g className="axes"><line x1={frame.left} x2={frame.left + plotWidth} y1={mapY(0)} y2={mapY(0)} /><line x1={mapX(0)} x2={mapX(0)} y1={frame.top} y2={frame.top + plotHeight} /></g>
          <path className="exponential-curve" d={path} />
          <line className="tangent-line" x1={mapX(xMin)} y1={mapY(tangentY(xMin))} x2={mapX(xMax)} y2={mapY(tangentY(xMax))} />
          <circle className="anchor-point" cx={mapX(safePoint)} cy={mapY(pointY)} r="7" />
        </svg>
        <footer className="graph-readout"><span>Производная — наклон касательной</span><strong>f′({formatNumber(safePoint)}) = {formatNumber(slope)}</strong></footer>
      </section>
      <aside className="parameters-panel">
        <header><span className="content-label">Параметры анимации</span><h2>Функция и точка</h2></header>
        <div className="function-buttons">{(Object.keys(labels) as DerivativeFunction[]).map((id) => <button className={kind === id ? 'is-active' : ''} key={id} type="button" onClick={() => { setKind(id); if ((id === 'ln' || id === 'log') && point <= 0) setPoint(1) }}>{labels[id]}</button>)}</div>
        {(kind === 'general-exp' || kind === 'log') && <BaseControl value={base} onChange={setBase} />}
        <Slider id="derivative-point" label="Точка x₀" value={safePoint} min={isLog ? 0.25 : -2} max={isLog ? 5 : 2} step={0.25} onChange={setPoint} />
        <div className="animation-result"><span>Производная в точке</span><strong>{formatNumber(slope)}</strong></div>
      </aside>
    </div>
  )
}
