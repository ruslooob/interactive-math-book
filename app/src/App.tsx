import { useEffect, useMemo, useState } from 'react'
import type { AnimationActions, AnimationState } from './components/AnimationParameters'
import { BookShell } from './components/BookShell'
import { ChapterPlaceholder } from './components/BookViews'
import { ComparisonPracticePage } from './components/ComparisonPracticePage'
import { ParagraphPage } from './components/ParagraphPage'
import { PracticePagePlaceholder } from './components/PracticePagePlaceholder'
import { book, type BookChapter } from './content/book'
import { chapter3Paragraphs } from './content/chapter3'
import { chapter3PageSequence } from './content/navigation'
import {
  comparisonSubpoints,
  isParagraph11PageId,
  paragraph11Pages,
  paragraph11ProgressStorageKey,
  type Paragraph11PageId,
} from './content/practice11'

type Route =
  | { kind: 'paragraph'; number: number; pageId: Paragraph11PageId; subpointIndex: number }
  | { kind: 'chapter'; number: number }

function practiceSubpointFromLocation() {
  const requestedSubpoint = Number(new URLSearchParams(window.location.search).get('subpoint'))
  if (Number.isInteger(requestedSubpoint) && requestedSubpoint >= 1 && requestedSubpoint <= comparisonSubpoints.length) return requestedSubpoint - 1
  return 0
}

function routeFromLocation(): Route {
  const params = new URLSearchParams(window.location.search)
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
      // Invalid local data must not prevent the lesson page from loading.
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
      : `Глава ${route.number}`
    document.title = `${title} — ${book.title}`
  }, [route])

  useEffect(() => {
    const url = new URL(window.location.href)
    url.searchParams.set('base', String(Number(base.toFixed(3))))
    for (const obsoleteParameter of ['variant', 'x', 'anchor', 'asymptote', 'table']) url.searchParams.delete(obsoleteParameter)
    if (url.searchParams.has('view')) {
      url.searchParams.delete('view')
      if (route.kind === 'paragraph') {
        url.searchParams.set('section', String(route.number))
        url.searchParams.set('page', route.pageId)
      }
    }
    window.history.replaceState({}, '', url)
  }, [base, route])

  useEffect(() => {
    try {
      window.localStorage.setItem(paragraph11ProgressStorageKey, JSON.stringify([...solvedComparisonSubpointIds]))
    } catch {
      // Unavailable local storage must not interrupt the current attempt.
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
    if (next.kind === 'chapter') url.searchParams.set('chapter', String(next.number))
    if (next.kind === 'paragraph') {
      url.searchParams.set('section', String(next.number))
      url.searchParams.set('page', next.pageId)
      if (next.pageId === 'compare-values') url.searchParams.set('subpoint', String(next.subpointIndex + 1))
    }
    window.history.pushState({}, '', url)
    setRoute(next)
  }

  const state: AnimationState = useMemo(() => ({ base }), [base])
  const actions: AnimationActions = { setBase }
  const openPage = (number: number, pageId: Paragraph11PageId) => navigate({ kind: 'paragraph', number, pageId, subpointIndex: 0 })
  const openChapter = (chapter: BookChapter) => navigate({ kind: 'chapter', number: chapter.number })
  const selectPracticeSubpoint = (subpointIndex: number) => {
    if (route.kind !== 'paragraph') return
    navigate({ ...route, subpointIndex })
  }
  const solvePracticeSubpoint = (subpointId: string) => {
    setSolvedComparisonSubpointIds((solved) => solved.has(subpointId) ? solved : new Set([...solved, subpointId]))
  }

  const currentChapterNumber = route.kind === 'chapter' ? route.number : 3
  const currentPageIndex = route.kind === 'paragraph'
    ? chapter3PageSequence.findIndex((page) => page.paragraphNumber === route.number && page.pageId === route.pageId)
    : -1
  const previousPage = currentPageIndex > 0 ? chapter3PageSequence[currentPageIndex - 1] : undefined
  const nextPage = currentPageIndex >= 0 ? chapter3PageSequence[currentPageIndex + 1] : undefined

  let content
  if (route.kind === 'chapter') {
    const chapter = book.chapters.find((item) => item.number === route.number)!
    content = <ChapterPlaceholder chapter={chapter} />
  } else {
    const paragraph = chapter3Paragraphs[route.number]
    const currentPage = route.number === 11
      ? paragraph11Pages.find((page) => page.id === route.pageId)!
      : { id: 'theory', title: '📖 Теория', kind: 'theory' as const }

    content = currentPage.kind === 'comparison' ? (
      <ComparisonPracticePage
        currentIndex={route.subpointIndex}
        solvedSubpointIds={solvedComparisonSubpointIds}
        onSelectSubpoint={selectPracticeSubpoint}
        onSolveSubpoint={solvePracticeSubpoint}
      />
    ) : currentPage.kind === 'theory' ? (
      <ParagraphPage paragraph={paragraph} state={state} actions={actions} />
    ) : (
      <PracticePagePlaceholder title={currentPage.title} />
    )
  }

  return (
    <BookShell
      currentChapterNumber={currentChapterNumber}
      currentParagraphNumber={route.kind === 'paragraph' ? route.number : undefined}
      currentPageId={route.kind === 'paragraph' ? route.pageId : undefined}
      solvedComparisonSubpointCount={solvedComparisonSubpointIds.size}
      previousPage={previousPage}
      nextPage={nextPage}
      onOpenPage={openPage}
      onOpenChapter={openChapter}
    >
      {content}
    </BookShell>
  )
}
