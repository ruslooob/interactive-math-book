export type Point = { x: number; y: number }

export const isValidBase = (base: number) => base > 0 && Math.abs(base - 1) > 0.001

export const expValue = (x: number, base: number) => base ** x

export const logValue = (x: number, base: number) => Math.log(x) / Math.log(base)

export const expDerivative = (x: number, base: number) => expValue(x, base) * Math.log(base)

export const logDerivative = (x: number, base: number) => 1 / (x * Math.log(base))

export function formatNumber(value: number, digits = 2) {
  if (!Number.isFinite(value)) return '—'
  if (Math.abs(value) < 0.0001) return '0'
  const rounded = Number(value.toFixed(digits))
  return rounded.toLocaleString('ru-RU')
}

export function monotonicity(base: number) {
  if (!isValidBase(base)) return 'нет обратной функции'
  return base > 1 ? 'возрастает' : 'убывает'
}

export function baseLabel(base: number) {
  if (Math.abs(base - Math.E) < 0.015) return 'e'
  return formatNumber(base, 2)
}

export function makePath(
  samples: Point[],
  scaleX: (value: number) => number,
  scaleY: (value: number) => number,
) {
  let started = false
  return samples.reduce((path, point) => {
    if (!Number.isFinite(point.y)) return path
    const command = started ? 'L' : 'M'
    started = true
    return `${path}${command}${scaleX(point.x).toFixed(2)},${scaleY(point.y).toFixed(2)}`
  }, '')
}
