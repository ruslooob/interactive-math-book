import { expect, test } from '@playwright/test'
import { adjacentBookPages, chapter3PageSequence } from '../app/src/content/navigation'

test('book route includes ready exercises in order between section theory pages', () => {
  const section11 = chapter3PageSequence.filter((page) => page.paragraphNumber === 11)
  expect(section11.map((page) => page.exerciseId ?? page.pageId)).toEqual([
    'theory', '11.1', '11.2', '11.3', '11.4', '11.5', '11.6', '11.7',
    '11.8', '11.9', '11.10', '11.11', '11.12', '11.13', '11.14', '11.15',
    '11.16', '11.17', '11.18', '11.19', '11.20', '11.21', '11.22',
    '11.23', '11.24', '11.25',
  ])
  const last = chapter3PageSequence.findIndex((page) => page.exerciseId === '11.25')
  expect(chapter3PageSequence[last + 1]).toMatchObject({ paragraphNumber: 12, pageId: 'theory' })
})

test('adjacent pages cross group and section boundaries in both directions', () => {
  for (const [from, fromGroup, to, toGroup] of [
    ['11.7', 'calculate-expression', '11.8', 'identify-functions'],
    ['11.12', 'find-function-value', '11.13', 'draw-graph'],
    ['11.16', 'draw-graph', '11.17', 'compare-values'],
  ] as const) {
    expect(adjacentBookPages({ paragraphNumber: 11, pageId: fromGroup, exerciseId: from }).next)
      .toMatchObject({ paragraphNumber: 11, pageId: toGroup, exerciseId: to })
    expect(adjacentBookPages({ paragraphNumber: 11, pageId: toGroup, exerciseId: to }).previous)
      .toMatchObject({ paragraphNumber: 11, pageId: fromGroup, exerciseId: from })
  }
  expect(adjacentBookPages({ paragraphNumber: 11, pageId: 'calculate-expression' }).previous)
    .toMatchObject({ paragraphNumber: 11, pageId: 'theory' })
  expect(adjacentBookPages({ paragraphNumber: 12, pageId: 'theory' }).previous)
    .toMatchObject({ exerciseId: '11.25' })
  expect(adjacentBookPages({ paragraphNumber: 11, pageId: 'find-integer-values' }))
    .toMatchObject({ previous: { exerciseId: '11.25' }, next: { paragraphNumber: 12, pageId: 'theory' } })
})
