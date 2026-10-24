// A small arithmetic grammar. Learner input never executes JavaScript.
// Supports decimals, fractions, powers, sqrt(x), root(n,x), and implicit products.
export function numericAnswer(source: string): number | null {
  if (source.length > 200) return null
  const text = source.replaceAll('−', '-').replaceAll('·', '*').replaceAll('√', 'sqrt')
    .replace(/root\(\s*(\d+)\s*,/g, 'root($1;')
    .replace(/(\d),(?=\d)/g, '$1.').replace(/\s+/g, '')
  const tokens = text.match(/(?:\d+(?:\.\d*)?|\.\d+)|sqrt|root|[()+*/^;\-]/g) ?? []
  if (!text || tokens.join('') !== text || tokens.length > 100) return null
  let index = 0
  const take = (token: string) => {
    if (tokens[index] !== token) return false
    index += 1
    return true
  }
  const require = (token: string) => { if (!take(token)) throw new Error('Invalid expression') }
  const atom = (): number => {
    if (take('(')) {
      const value = sum()
      require(')')
      return value
    }
    if (take('sqrt')) {
      require('(')
      const value = sum()
      require(')')
      return Math.sqrt(value)
    }
    if (take('root')) {
      require('(')
      const degree = sum()
      require(';')
      const value = sum()
      require(')')
      return degree > 0 && Number.isInteger(degree)
        ? value < 0 && degree % 2 === 1 ? -((-value) ** (1 / degree)) : value ** (1 / degree)
        : NaN
    }
    const token = tokens[index++]
    if (!token || !/^\d|^\.\d/.test(token)) throw new Error('Missing value')
    return Number(token)
  }
  const power = (): number => {
    const value = atom()
    return take('^') ? value ** unary() : value
  }
  const unary = (): number => take('+') ? unary() : take('-') ? -unary() : power()
  const product = (): number => {
    let value = unary()
    while (index < tokens.length) {
      if (take('*')) value *= unary()
      else if (take('/')) value /= unary()
      else if (tokens[index] === '(' || tokens[index] === 'sqrt' || tokens[index] === 'root') value *= unary()
      else break
    }
    return value
  }
  const sum = (): number => {
    let value = product()
    while (index < tokens.length) {
      if (take('+')) value += product()
      else if (take('-')) value -= product()
      else break
    }
    return value
  }
  try {
    const value = sum()
    return index === tokens.length && Number.isFinite(value) ? value : null
  } catch {
    return null
  }
}
