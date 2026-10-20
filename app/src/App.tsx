import { useEffect, useMemo, useState } from 'react'
import type { AnimationActions, AnimationState } from './components/AnimationParameters'
import { BookShell } from './components/BookShell'
import { ChapterPlaceholder } from './components/BookViews'
import { ParagraphPage } from './components/ParagraphPage'
import { PracticePagePlaceholder } from './components/PracticePagePlaceholder'
import { GraphComparisonPractice, graphComparisonAvailable } from './components/GraphComparisonPractice'
import { recordParagraph11Result } from './content/paragraph11Progress'
import { book, type BookChapter } from './content/book'
import { chapter3Paragraphs } from './content/chapter3'
import { chapter3PageSequence } from './content/navigation'
import {
  isParagraph11PageId,
  paragraph11Pages,
  type Paragraph11PageId,
} from './content/practice11'
import { loadParagraph11Progress, saveParagraph11Progress, summarizeParagraph11Progress } from './content/paragraph11Progress'

type Route =
  | { kind: 'paragraph'; number: number; pageId: Paragraph11PageId; exerciseId?: string }
  | { kind: 'chapter'; number: number }

function routeFromLocation(): Route {
  const params = new URLSearchParams(window.location.search)
  const chapter = Number(params.get('chapter'))
  if (book.chapters.some((item) => item.number === chapter && chapter !== 3)) return { kind: 'chapter', number: chapter }
  const paragraph = Number(params.get('section'))
  if (chapter3Paragraphs[paragraph]) {
    const requestedPage = params.get('page')
    const pageId = paragraph === 11 && isParagraph11PageId(requestedPage) ? requestedPage : 'theory'
    return { kind: 'paragraph', number: paragraph, pageId, exerciseId: params.get('exercise') ?? undefined }
  }
  return { kind: 'paragraph', number: 11, pageId: 'theory' }
}

function initialBase() {
  const value = Number(new URLSearchParams(window.location.search).get('base'))
  return Number.isFinite(value) && value >= 0.2 && value <= 4 ? value : 2
}

export function App() {
  const [route, setRoute] = useState<Route>(routeFromLocation)
  const [base, setBase] = useState(initialBase)
  const [solvedPartIds, setSolvedPartIds] = useState(() => loadParagraph11Progress())
  const progress = useMemo(() => summarizeParagraph11Progress(solvedPartIds), [solvedPartIds])

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
    saveParagraph11Progress(solvedPartIds)
  }, [solvedPartIds])

  const navigate = (next: Route) => {
    const url = new URL(window.location.href)
    url.searchParams.delete('view')
    url.searchParams.delete('chapter')
    url.searchParams.delete('section')
    url.searchParams.delete('page')
    url.searchParams.delete('step')
    url.searchParams.delete('subpoint')
    url.searchParams.delete('exercise')
    if (next.kind === 'chapter') url.searchParams.set('chapter', String(next.number))
    if (next.kind === 'paragraph') {
      url.searchParams.set('section', String(next.number))
      url.searchParams.set('page', next.pageId)
      if (next.exerciseId) url.searchParams.set('exercise', next.exerciseId)
    }
    window.history.pushState({}, '', url)
    setRoute(next)
  }

  const state: AnimationState = useMemo(() => ({ base }), [base])
  const actions: AnimationActions = { setBase }
  const openPage = (number: number, pageId: Paragraph11PageId) => navigate({ kind: 'paragraph', number, pageId })
  const openChapter = (chapter: BookChapter) => navigate({ kind: 'chapter', number: chapter.number })

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

    content = currentPage.kind === 'theory' ? (
      <ParagraphPage paragraph={paragraph} state={state} actions={actions} />
    ) : (
      graphComparisonAvailable.some((exercise) => exercise.practiceGroup === currentPage.id) ? <div className="practice-surface">
        <h2 className="practice-title">{currentPage.title}</h2>
        <GraphComparisonPractice key={`${currentPage.id}:${route.exerciseId ?? ''}`} group={currentPage.id} exerciseId={route.exerciseId} solvedIds={solvedPartIds}
          onSelect={(exerciseId) => navigate({ ...route, exerciseId })}
          onResult={(id, result) => setSolvedPartIds((ids) => recordParagraph11Result(ids, id, result))} />
      </div> : <PracticePagePlaceholder title={currentPage.title} />
    )
  }

  return (
    <BookShell
      currentChapterNumber={currentChapterNumber}
      currentParagraphNumber={route.kind === 'paragraph' ? route.number : undefined}
      currentPageId={route.kind === 'paragraph' ? route.pageId : undefined}
      currentExerciseId={route.kind === 'paragraph' ? route.exerciseId : undefined}
      progress={progress}
      previousPage={previousPage}
      nextPage={nextPage}
      onOpenPage={openPage}
      onOpenExercise={(exerciseId, pageId) => navigate({ kind: 'paragraph', number: 11, pageId, exerciseId })}
      onOpenChapter={openChapter}
    >
      {content}
    </BookShell>
  )
}
