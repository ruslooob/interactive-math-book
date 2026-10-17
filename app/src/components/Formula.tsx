import katex from 'katex'

type FormulaProps = {
  children: string
  display?: boolean
  className?: string
}

export function Formula({ children, display = false, className = '' }: FormulaProps) {
  const html = katex.renderToString(children, {
    throwOnError: false,
    displayMode: display,
    output: 'html',
  })

  return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />
}
