export function exponentialValue(base: number, x: number) {
  return base ** x
}

export function formatNumber(value: number, digits = 3) {
  if (!Number.isFinite(value)) return '—'
  if (Math.abs(value) >= 1000 || (Math.abs(value) > 0 && Math.abs(value) < 0.001)) {
    return value.toExponential(2).replace('.', ',')
  }

  return Number(value.toFixed(digits)).toLocaleString('ru-RU')
}

export function describeBase(base: number) {
  if (base === 1) {
    return {
      title: 'Постоянная функция',
      tone: 'boundary' as const,
    }
  }

  if (base > 1) {
    return {
      title: 'Функция возрастает',
      tone: 'growth' as const,
    }
  }

  return {
    title: 'Функция убывает',
    tone: 'decay' as const,
  }
}
