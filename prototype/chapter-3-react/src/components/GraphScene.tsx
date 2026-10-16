import { useId, useMemo } from 'react'
import type { SectionId } from '../content/chapter'
import {
  baseLabel,
  expDerivative,
  expValue,
  formatNumber,
  isValidBase,
  logDerivative,
  logValue,
  makePath,
} from '../lib/math'

type GraphSceneProps = {
  base: number
  probeX: number
  target: number
  sectionId: SectionId
  showExp: boolean
  showLog: boolean
  showMirror: boolean
  compact?: boolean
}

const width = 760
const height = 510
const margin = { left: 54, right: 24, top: 24, bottom: 44 }
const domain = { xMin: -4, xMax: 6, yMin: -4, yMax: 8 }
const plotWidth = width - margin.left - margin.right
const plotHeight = height - margin.top - margin.bottom

const sx = (value: number) => margin.left + ((value - domain.xMin) / (domain.xMax - domain.xMin)) * plotWidth
const sy = (value: number) => margin.top + ((domain.yMax - value) / (domain.yMax - domain.yMin)) * plotHeight

function tangentPath(pointX: number, pointY: number, slope: number) {
  const x1 = Math.max(domain.xMin, pointX - 1.5)
  const x2 = Math.min(domain.xMax, pointX + 1.5)
  return `M${sx(x1)},${sy(pointY + slope * (x1 - pointX))} L${sx(x2)},${sy(pointY + slope * (x2 - pointX))}`
}

export function GraphScene({
  base,
  probeX,
  target,
  sectionId,
  showExp,
  showLog,
  showMirror,
  compact = false,
}: GraphSceneProps) {
  const clipId = useId().replaceAll(':', '')
  const valid = isValidBase(base)
  const equationMode = sectionId === 12 || sectionId === 17
  const inequalityMode = sectionId === 13 || sectionId === 18
  const derivativeMode = sectionId === 19
  const inverseMode = sectionId === 14 || sectionId === 15

  const paths = useMemo(() => {
    if (!valid) return { exp: '', log: '' }
    const expSamples = Array.from({ length: 241 }, (_, index) => {
      const x = domain.xMin + (index / 240) * (domain.xMax - domain.xMin)
      return { x, y: expValue(x, base) }
    }).filter((point) => point.y > domain.yMin - 1 && point.y < domain.yMax + 1)
    const logSamples = Array.from({ length: 241 }, (_, index) => {
      const x = 0.035 + (index / 240) * (domain.xMax - 0.035)
      return { x, y: logValue(x, base) }
    }).filter((point) => point.y > domain.yMin - 1 && point.y < domain.yMax + 1)
    return {
      exp: makePath(expSamples, sx, sy),
      log: makePath(logSamples, sx, sy),
    }
  }, [base, valid])

  const expY = valid ? expValue(probeX, base) : 1
  const reflectedX = expY
  const equationX = valid ? logValue(target, base) : 0
  const logEquationX = valid ? expValue(probeX, base) : 1
  const expSlope = valid ? expDerivative(probeX, base) : 0
  const logSlope = valid && reflectedX > 0 ? logDerivative(reflectedX, base) : 0
  const shadeFrom = base > 1 ? equationX : domain.xMin
  const shadeTo = base > 1 ? domain.xMax : equationX

  const ticksX = [-4, -2, 0, 2, 4, 6]
  const ticksY = [-4, -2, 0, 2, 4, 6, 8]

  return (
    <div className={`graph-shell${compact ? ' graph-shell--compact' : ''}`}>
      <div className="graph-head">
        <div>
          <span className="eyebrow">Общая модель</span>
          <h2>Две функции · одна история</h2>
        </div>
        <div className="graph-legend" aria-label="Легенда графика">
          <span><i className="legend-dot legend-dot--exp" />aˣ</span>
          <span><i className="legend-dot legend-dot--log" />logₐx</span>
          <span><i className="legend-line" />y = x</span>
        </div>
      </div>

      <svg className="graph" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Связанные графики показательной и логарифмической функций">
        <defs>
          <clipPath id={clipId}>
            <rect x={margin.left} y={margin.top} width={plotWidth} height={plotHeight} rx="10" />
          </clipPath>
          <pattern id={`${clipId}-hatch`} width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="9" className="hatch-line" />
          </pattern>
        </defs>

        <g className="grid">
          {ticksX.map((tick) => <line key={`x-${tick}`} x1={sx(tick)} y1={margin.top} x2={sx(tick)} y2={height - margin.bottom} />)}
          {ticksY.map((tick) => <line key={`y-${tick}`} x1={margin.left} y1={sy(tick)} x2={width - margin.right} y2={sy(tick)} />)}
        </g>

        <g clipPath={`url(#${clipId})`}>
          {inequalityMode && valid && sectionId === 13 && (
            <rect className="solution-area" x={sx(shadeFrom)} y={margin.top} width={Math.max(0, sx(shadeTo) - sx(shadeFrom))} height={plotHeight} />
          )}
          {inequalityMode && sectionId === 18 && (
            <>
              <rect className="forbidden-area" x={margin.left} y={margin.top} width={sx(0) - margin.left} height={plotHeight} fill={`url(#${clipId}-hatch)`} />
              {valid && <rect className="solution-area" x={base > 1 ? sx(logEquationX) : sx(0)} y={margin.top} width={base > 1 ? sx(domain.xMax) - sx(logEquationX) : sx(logEquationX) - sx(0)} height={plotHeight} />}
            </>
          )}

          {showMirror && <line className="mirror-axis" x1={sx(domain.xMin)} y1={sy(domain.xMin)} x2={sx(domain.xMax)} y2={sy(domain.xMax)} />}
          <line className="axis" x1={margin.left} y1={sy(0)} x2={width - margin.right} y2={sy(0)} />
          <line className="axis" x1={sx(0)} y1={margin.top} x2={sx(0)} y2={height - margin.bottom} />

          {!valid && <line className="excluded-curve" x1={margin.left} y1={sy(1)} x2={width - margin.right} y2={sy(1)} />}
          {valid && showExp && <path className={`curve curve--exp${sectionId === 15 || sectionId === 17 || sectionId === 18 ? ' curve--quiet' : ''}`} d={paths.exp} />}
          {valid && showLog && <path className={`curve curve--log${sectionId === 11 || sectionId === 12 || sectionId === 13 ? ' curve--quiet' : ''}`} d={paths.log} />}

          {(equationMode || inequalityMode) && valid && sectionId <= 13 && (
            <>
              <line className="level-line" x1={margin.left} y1={sy(target)} x2={width - margin.right} y2={sy(target)} />
              <line className="answer-guide" x1={sx(equationX)} y1={sy(0)} x2={sx(equationX)} y2={sy(target)} />
              <circle className="point point--answer" cx={sx(equationX)} cy={sy(target)} r="6" />
            </>
          )}

          {(equationMode || inequalityMode) && valid && sectionId >= 17 && sectionId <= 18 && (
            <>
              <line className="level-line" x1={sx(0)} y1={sy(probeX)} x2={width - margin.right} y2={sy(probeX)} />
              <line className="answer-guide" x1={sx(logEquationX)} y1={sy(0)} x2={sx(logEquationX)} y2={sy(probeX)} />
              <circle className="point point--answer" cx={sx(logEquationX)} cy={sy(probeX)} r="6" />
            </>
          )}

          {valid && (inverseMode || derivativeMode) && expY < domain.yMax && reflectedX < domain.xMax && (
            <>
              <line className="point-bridge" x1={sx(probeX)} y1={sy(expY)} x2={sx(reflectedX)} y2={sy(probeX)} />
              <circle className="point point--exp" cx={sx(probeX)} cy={sy(expY)} r="6" />
              <circle className="point point--log" cx={sx(reflectedX)} cy={sy(probeX)} r="6" />
            </>
          )}

          {valid && derivativeMode && expY < domain.yMax && reflectedX < domain.xMax && (
            <>
              <path className="tangent tangent--exp" d={tangentPath(probeX, expY, expSlope)} />
              <path className="tangent tangent--log" d={tangentPath(reflectedX, probeX, logSlope)} />
            </>
          )}
        </g>

        {ticksX.map((tick) => <text className="tick" key={`xt-${tick}`} x={sx(tick)} y={sy(0) + 20} textAnchor="middle">{tick}</text>)}
        {ticksY.filter((tick) => tick !== 0).map((tick) => <text className="tick" key={`yt-${tick}`} x={sx(0) - 12} y={sy(tick) + 4} textAnchor="end">{tick}</text>)}
        <text className="axis-label" x={width - margin.right - 5} y={sy(0) - 10}>x</text>
        <text className="axis-label" x={sx(0) + 10} y={margin.top + 14}>y</text>

        {!valid && (
          <g className="excluded-note" transform={`translate(${sx(1.25)} ${sy(4.8)})`}>
            <rect x="-128" y="-38" width="256" height="76" rx="12" />
            <text textAnchor="middle" y="-7">a = 1 даёт только y = 1</text>
            <text textAnchor="middle" y="17">обратной функции не существует</text>
          </g>
        )}
      </svg>

      <div className="graph-readout" aria-live="polite">
        {!valid ? (
          <><strong>Граница определения.</strong> Все x дают одно значение, поэтому восстановить x по результату нельзя.</>
        ) : sectionId === 12 || sectionId === 13 ? (
          <><strong>aˣ = {formatNumber(target)}</strong><span>x = log<sub>{baseLabel(base)}</sub>{formatNumber(target)} = {formatNumber(equationX)}</span></>
        ) : sectionId === 17 || sectionId === 18 ? (
          <><strong>log<sub>{baseLabel(base)}</sub>x = {formatNumber(probeX)}</strong><span>x = {baseLabel(base)}<sup>{formatNumber(probeX)}</sup> = {formatNumber(logEquationX)}</span></>
        ) : sectionId === 19 ? (
          <><strong>Наклоны в зеркальных точках</strong><span>{formatNumber(expSlope)} × {formatNumber(logSlope)} = {formatNumber(expSlope * logSlope)}</span></>
        ) : (
          <><strong>Зеркальная пара</strong><span>({formatNumber(probeX)}; {formatNumber(expY)}) ↔ ({formatNumber(expY)}; {formatNumber(probeX)})</span></>
        )}
      </div>
    </div>
  )
}
