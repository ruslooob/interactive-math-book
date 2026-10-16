import { useEffect, useMemo, useState } from 'react'
import type { AnimationActions, AnimationState } from './components/AnimationParameters'
import { ChapterPlaceholder, TableOfContents } from './components/BookViews'
import { ParagraphPrototype } from './components/ParagraphPrototype'
import { book, type BookChapter } from './content/book'
import { chapter3Paragraphs } from './content/chapter3'

type Route =
  | { kind: 'contents' }
  | { kind: 'paragraph'; number: number }
  | { kind: 'chapter'; number: number }

function routeFromLocation(): Route {
  const params = new URLSearchParams(window.location.search)
  if (params.get('view') === 'contents') return { kind: 'contents' }
  const chapter = Number(params.get('chapter'))
  if (book.chapters.some((item) => item.number === chapter && chapter !== 3)) return { kind: 'chapter', number: chapter }
  const paragraph = Number(params.get('section'))
  if (chapter3Paragraphs[paragraph]) return { kind: 'paragraph', number: paragraph }
  return { kind: 'paragraph', number: 11 }
}

function initialBase() {
  const value = Number(new URLSearchParams(window.location.search).get('base'))
  return Number.isFinite(value) && value >= 0.2 && value <= 4 ? value : 2
}

export function App() {
  const [route, setRoute] = useState<Route>(routeFromLocation)
  const [base, setBase] = useState(initialBase)

  useEffect(() => {
    const onPopState = () => setRoute(routeFromLocation())
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    const title = route.kind === 'paragraph'
      ? `§ ${route.number}. ${chapter3Paragraphs[route.number].title}`
      : route.kind === 'contents'
        ? 'Оглавление'
        : `Глава ${route.number}`
    document.title = `${title} — ${book.title}`
  }, [route])

  useEffect(() => {
    const url = new URL(window.location.href)
    url.searchParams.set('base', String(Number(base.toFixed(3))))
    for (const obsoleteParameter of ['variant', 'x', 'anchor', 'asymptote', 'table']) url.searchParams.delete(obsoleteParameter)
    window.history.replaceState({}, '', url)
  }, [base])

  const navigate = (next: Route) => {
    const url = new URL(window.location.href)
    url.searchParams.delete('view')
    url.searchParams.delete('chapter')
    url.searchParams.delete('section')
    if (next.kind === 'contents') url.searchParams.set('view', 'contents')
    if (next.kind === 'chapter') url.searchParams.set('chapter', String(next.number))
    if (next.kind === 'paragraph') url.searchParams.set('section', String(next.number))
    window.history.pushState({}, '', url)
    setRoute(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const state: AnimationState = useMemo(() => ({ base }), [base])
  const actions: AnimationActions = { setBase }
  const openContents = () => navigate({ kind: 'contents' })
  const openParagraph = (number: number) => navigate({ kind: 'paragraph', number })
  const openChapter = (chapter: BookChapter) => navigate({ kind: 'chapter', number: chapter.number })

  if (route.kind === 'contents') return <TableOfContents onOpenParagraph={openParagraph} onOpenChapter={openChapter} />

  if (route.kind === 'chapter') {
    const chapter = book.chapters.find((item) => item.number === route.number)!
    return <ChapterPlaceholder chapter={chapter} onOpenContents={openContents} />
  }

  return (
    <ParagraphPrototype
      key={route.number}
      paragraph={chapter3Paragraphs[route.number]}
      state={state}
      actions={actions}
      onOpenContents={openContents}
      onOpenParagraph={openParagraph}
    />
  )
}
