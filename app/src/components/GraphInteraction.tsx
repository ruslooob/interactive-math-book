import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { formatNumber } from '../lib/exponential'

export type InspectedPoint = {
  x: number
  y: number
}

export function useGraphInteraction({
  width,
  frameLeft,
  plotWidth,
  xMin,
  xMax,
  valueAt,
  isValid = () => true,
}: {
  width: number
  frameLeft: number
  plotWidth: number
  xMin: number
  xMax: number
  valueAt: (x: number) => number
  isValid?: (x: number) => boolean
}) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [hoverX, setHoverX] = useState<number | null>(null)
  const point = hoverX === null ? null : { x: hoverX, y: valueAt(hoverX) }

  const inspectPoint = (event: ReactPointerEvent<SVGSVGElement>) => {
    const bounds = svgRef.current?.getBoundingClientRect()
    if (!bounds) return
    const svgX = ((event.clientX - bounds.left) / bounds.width) * width
    const x = xMin + ((svgX - frameLeft) / plotWidth) * (xMax - xMin)
    if (x < xMin || x > xMax || !isValid(x)) {
      setHoverX(null)
      return
    }
    setHoverX(Number(x.toFixed(2)))
  }

  return {
    svgRef,
    point,
    graphInteractionProps: {
      onPointerMove: inspectPoint,
      onPointerDown: inspectPoint,
      onPointerLeave: () => setHoverX(null),
    },
  }
}

export function GraphPoint({
  point,
  mapX,
  mapY,
  baselineY,
  graphWidth,
  yMin,
  yMax,
}: {
  point: InspectedPoint | null
  mapX: (x: number) => number
  mapY: (y: number) => number
  baselineY: number
  graphWidth: number
  yMin: number
  yMax: number
}) {
  if (!point || !Number.isFinite(point.y) || point.y < yMin || point.y > yMax) return null
  const pointX = mapX(point.x)
  const pointY = mapY(point.y)
  const tooltipX = pointX > graphWidth - 175 ? pointX - 150 : pointX + 12

  return (
    <g className="hover-point">
      <line x1={pointX} x2={pointX} y1={baselineY} y2={pointY} />
      <circle cx={pointX} cy={pointY} r="7" />
      <g transform={`translate(${tooltipX} ${Math.max(pointY - 37, 11)})`}>
        <rect width="138" height="29" rx="7" />
        <text x="10" y="19">({formatNumber(point.x)}; {formatNumber(point.y)})</text>
      </g>
    </g>
  )
}

export function GraphReadout({ point, idleText, detail }: { point: InspectedPoint | null; idleText: string; detail?: string }) {
  return (
    <footer className="graph-readout" aria-live="polite">
      {!point || !Number.isFinite(point.y) ? (
        <>
          <span>{idleText}</span>
          {detail && <strong>{detail}</strong>}
        </>
      ) : (
        <>
          <span>Точка на графике</span>
          <strong>x = {formatNumber(point.x)}</strong>
          <i aria-hidden="true">→</i>
          <strong>y = {formatNumber(point.y)}</strong>
        </>
      )}
    </footer>
  )
}
