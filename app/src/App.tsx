import { useEffect, useMemo, useState } from 'react'
import type { AnimationActions, AnimationState } from './components/AnimationParameters'
import { BookShell } from './components/BookShell'
import { ChapterPlaceholder, TableOfContents } from './components/BookViews'
import { ComparisonPracticePage } from './components/ComparisonPracticePage'
import { ParagraphPage } from './components/ParagraphPage'
import { PracticePagePlaceholder } from './components/PracticePagePlaceholder'
import { book, type BookChapter } from './content/book'
import { chapter3Paragraphs } from './content/chapter3'
import {
  comparisonSubpoints,
  isParagraph11PageId,
  paragraph11Pages,
  paragraph11ProgressStorageKey,
  type Paragraph11PageId,
} from './content/practice11'

type Route =
  | { kind: 'contents' }
  | { kind: 'paragraph'; number: number; pageId: Paragraph11PageId; subpointIndex: number }
  | { kind: 'chapter'; number: number }

function practiceSubpointFromLocation() {
  const requestedSubpoint = Number(new URLSearchParams(window.location.search).get('subpoint'))
  if (Number.isInteger(requestedSubpoint) && requestedSubpoint >= 1 && requestedSubpoint <= comparisonSubpoints.length) return requestedSubpoint - 1
  return 0
}

function routeFromLocation(): Route {
  const params = new URLSearchParams(window.location.search)
  if (params.get('view') === 'contents') return { kind: 'contents' }
  const chapter = Number(params.get('chapter'))
  if (book.chapters.some((item) => item.number === chapter && chapter !== 3)) return { kind: 'chapter', number: chapter }
  const paragraph = Number(params.get('section'))
  if (chapter3Paragraphs[paragraph]) {
    const requestedPage = params.get('page')
    const pageId = paragraph === 11 && isParagraph11PageId(requestedPage) ? requestedPage : 'theory'
    return { kind: 'paragraph', number: paragraph, pageId, subpointIndex: practiceSubpointFromLocation() }
  }
  return { kind: 'paragraph', number: 11, pageId: 'theory', subpointIndex: practiceSubpointFromLocation() }
}

function initialBase() {
  const value = Number(new URLSearchParams(window.location.search).get('base'))
  return Number.isFinite(value) && value >= 0.2 && value <= 4 ? value : 2
}

export function App() {
  const [route, setRoute] = useState<Route>(routeFromLocation)
  const [base, setBase] = useState(initialBase)
  const [solvedComparisonSubpointIds, setSolvedComparisonSubpointIds] = useState<Set<string>>(() => {
    const solved = new Set<string>()
    try {
      const saved = JSON.parse(window.localStorage.getItem(paragraph11ProgressStorageKey) ?? '[]')
      if (Array.isArray(saved)) {
        const validIds = new Set(comparisonSubpoints.map((subpoint) => subpoint.id))
        saved.forEach((id) => typeof id === 'string' && validIds.has(id) && solved.add(id))
      }
    } catch {
      // Повреждённые локальные данные не должны блокировать учебную страницу.
    }
    return solved
  })

  useEffect(() => {
    const onPopState = () => setRoute(routeFromLocation())
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    const title = route.kind === 'paragraph'
      ? route.number === 11 && route.pageId !== 'theory'
        ? `${paragraph11Pages.find((page) => page.id === route.pageId)?.title} — §${route.number}`
        : `§${route.number}. ${chapter3Paragraphs[route.number].title}`
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

  useEffect(() => {
    try {
      window.localStorage.setItem(paragraph11ProgressStorageKey, JSON.stringify([...solvedComparisonSubpointIds]))
    } catch {
      // Недоступное локальное хранилище не должно блокировать текущую попытку.
    }
  }, [solvedComparisonSubpointIds])

  const navigate = (next: Route) => {
    const url = new URL(window.location.href)
    url.searchParams.delete('view')
    url.searchParams.delete('chapter')
    url.searchParams.delete('section')
    url.searchParams.delete('page')
    url.searchParams.delete('step')
    url.searchParams.delete('subpoint')
    if (next.kind === 'contents') url.searchParams.set('view', 'contents')
    if (next.kind === 'chapter') url.searchParams.set('chapter', String(next.number))
    if (next.kind === 'paragraph') {
      url.searchParams.set('section', String(next.number))
      url.searchParams.set('page', next.pageId)
      if (next.pageId === 'compare-values') url.searchParams.set('subpoint', String(next.subpointIndex + 1))
    }
    window.history.pushState({}, '', url)
    setRoute(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const state: AnimationState = useMemo(() => ({ base }), [base])
  const actions: AnimationActions = { setBase }
  const openContents = () => navigate({ kind: 'contents' })
  const openParagraph = (number: number) => navigate({ kind: 'paragraph', number, pageId: 'theory', subpointIndex: 0 })
  const openPage = (number: number, pageId: Paragraph11PageId) => navigate({ kind: 'paragraph', number, pageId, subpointIndex: 0 })
  const openChapter = (chapter: BookChapter) => navigate({ kind: 'chapter', number: chapter.number })
  const selectPracticeSubpoint = (subpointIndex: number) => {
    if (route.kind !== 'paragraph') return
    navigate({ ...route, subpointIndex })
  }
  const solvePracticeSubpoint = (subpointId: string) => {
    setSolvedComparisonSubpointIds((solved) => solved.has(subpointId) ? solved : new Set([...solved, subpointId]))
  }

  if (route.kind === 'contents') return <TableOfContents onOpenParagraph={openParagraph} onOpenChapter={openChapter} />

  if (route.kind === 'chapter') {
    const chapter = book.chapters.find((item) => item.number === route.number)!
    return <ChapterPlaceholder chapter={chapter} onOpenContents={openContents} />
  }

  const paragraph = chapter3Paragraphs[route.number]
  if (route.number !== 11) {
    return (
      <ParagraphPage
        key={route.number}
        paragraph={paragraph}
        state={state}
        actions={actions}
        onOpenContents={openContents}
        onOpenParagraph={openParagraph}
      />
    )
  }

  const currentPage = paragraph11Pages.find((page) => page.id === route.pageId)!

  return (
    <BookShell
      paragraphNumber={route.number}
      paragraphTitle={`§${paragraph.number}. ${paragraph.title}`}
      currentPageId={route.pageId}
      solvedComparisonSubpointCount={solvedComparisonSubpointIds.size}
      onOpenPage={openPage}
      onOpenChapter={openChapter}
    >
      {currentPage.kind === 'comparison' ? (
        <ComparisonPracticePage
          currentIndex={route.subpointIndex}
          solvedSubpointIds={solvedComparisonSubpointIds}
          onSelectSubpoint={selectPracticeSubpoint}
          onSolveSubpoint={solvePracticeSubpoint}
        />
      ) : currentPage.kind === 'theory' ? (
        <ParagraphPage
          paragraph={paragraph}
          state={state}
          actions={actions}
          onOpenContents={openContents}
          onOpenParagraph={openParagraph}
          embedded
        />
      ) : (
        <PracticePagePlaceholder title={currentPage.title} />
      )}
    </BookShell>
  )
}
