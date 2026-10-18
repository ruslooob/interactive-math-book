import { expect, test, type Page } from '@playwright/test'

const practiceUrl = '/?section=11&page=compare-values'

async function openBookTree(page: Page) {
  const button = page.getByRole('button', { name: 'Открыть дерево книги' })
  await button.click()
  await expect(page.getByRole('button', { name: 'Закрыть дерево книги' })).toHaveAttribute('aria-expanded', 'true')
  const tree = page.getByRole('navigation', { name: 'Дерево книги' })
  await expect(tree).toBeInViewport()
  await expect(tree).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)')
}

test.beforeEach(async ({ page }) => {
  await page.goto(practiceUrl)
  await page.evaluate(() => window.localStorage.clear())
  await page.reload()
})

test('book tree is available on theory pages and stays open during navigation', async ({ page }) => {
  await page.goto('/?section=12')
  await expect(page.getByRole('heading', { name: 'Interactive Books' })).toBeVisible()
  await expect(page.getByRole('heading', { name: '§12. Показательные уравнения' })).toBeVisible()
  await expect(page.getByText('68 из 282 решено')).toBeVisible()
  await openBookTree(page)

  const tree = page.getByRole('navigation', { name: 'Дерево книги' })
  await expect(tree.getByText('Алгебра и начала математического анализа. 11 класс')).toBeVisible()
  await expect(tree.getByText(/^Глава /)).toHaveCount(6)
  await expect(tree.getByText(/Упражнение 11\.17/)).toHaveCount(0)

  await tree.getByText('§19. Дифференцирование показательной и логарифмической функций', { exact: true }).click()
  await tree.getByRole('button', { name: '§19. Дифференцирование показательной и логарифмической функций — 📖 Теория' }).click()
  await expect(page).toHaveURL(/section=19&page=theory/)
  await expect(page.getByRole('heading', { name: '§19. Дифференцирование показательной и логарифмической функций' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Закрыть дерево книги' })).toHaveAttribute('aria-expanded', 'true')
  await expect(tree).toBeInViewport()

  await tree.getByText('§11. Показательная функция, её свойства и график', { exact: true }).click()
  await tree.getByRole('button', { name: '§11. Показательная функция, её свойства и график — 📖 Теория' }).click()
  await expect(page).toHaveURL(/section=11&page=theory/)
  await expect(page.getByRole('heading', { name: '§11. Показательная функция, её свойства и график' })).toBeVisible()
  await expect(tree).toBeInViewport()

  const completedPage = tree.getByRole('button', { name: '§11. Показательная функция, её свойства и график — 🧮 Найдите значение выражения' })
  await expect(completedPage).toHaveClass(/is-complete/)
  await expect(completedPage).toHaveCSS('border-left-width', '0px')
  await completedPage.click()
  await expect(page).toHaveURL(/section=11&page=calculate-expression/)
  await expect(page.getByRole('heading', { name: '🧮 Найдите значение выражения' })).toBeVisible()
  await expect(tree).toBeInViewport()

  await tree.getByRole('button', { name: '§11. Показательная функция, её свойства и график — ⚖️ Сравните значения функции' }).click()
  await expect(page).toHaveURL(/section=11&page=compare-values/)
  await expect(tree).toBeInViewport()
})

test('bottom navigation follows tree pages without a contents link', async ({ page }) => {
  await page.goto('/?section=11&page=theory')
  const pagination = page.getByRole('navigation', { name: 'Переход между страницами книги' })
  await expect(pagination.getByRole('button', { name: 'Оглавление' })).toHaveCount(0)

  await pagination.getByRole('button', { name: '🧮 Найдите значение выражения' }).click()
  await expect(page).toHaveURL(/section=11&page=calculate-expression/)
  await pagination.getByRole('button', { name: '§11. Показательная функция, её свойства и график' }).click()
  await expect(page).toHaveURL(/section=11&page=theory/)

  await page.goto('/?section=11&page=solve-inequality')
  await pagination.getByRole('button', { name: '§12. Показательные уравнения' }).click()
  await expect(page).toHaveURL(/section=12&page=theory/)
  await pagination.getByRole('button', { name: '⚠️ Решите неравенство' }).click()
  await expect(page).toHaveURL(/section=11&page=solve-inequality/)
})

test('legacy contents route opens the book without breadcrumbs', async ({ page }) => {
  await page.goto('/?view=contents')
  await expect(page).toHaveURL(/section=11&page=theory/)
  await expect(page.getByRole('navigation', { name: 'Положение в книге' })).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Оглавление' })).toHaveCount(0)
  await expect(page.getByRole('heading', { name: '§11. Показательная функция, её свойства и график' })).toBeVisible()
})

test('correct answers preserve progress across navigation, reload, and another attempt', async ({ page }) => {
  await expect(page.getByText('1 из 8')).toBeVisible()
  const currentSegment = page.getByRole('button', { name: '1 из 8: текущий, не решён' })
  await currentSegment.focus()
  await currentSegment.press('ArrowRight')
  const secondSegment = page.getByRole('button', { name: '2 из 8: текущий, не решён' })
  await expect(secondSegment).toBeFocused()
  await expect(page.getByText('2 из 8')).toBeVisible()
  await expect(page.getByText('Упражнение 11.17')).toBeVisible()
  await expect(page.getByText('Подпункт б')).toBeVisible()

  await page.getByLabel('Знак сравнения').selectOption('less')
  await page.getByRole('button', { name: 'Проверить' }).click()
  await expect(page.getByText(/Верно:/)).toBeVisible()
  await expect(page.getByRole('button', { name: '2 из 8: текущий, решён' })).toHaveClass(/is-solved/)
  await expect(page.getByText('69 из 282 решено')).toBeVisible()

  await page.getByRole('button', { name: '1 из 8: не решён' }).click()
  await page.getByRole('button', { name: '2 из 8: решён' }).click()
  await page.reload()
  await expect(page.getByRole('button', { name: '2 из 8: текущий, решён' })).toHaveClass(/is-solved/)

  await page.getByLabel('Знак сравнения').selectOption('greater')
  await page.getByRole('button', { name: 'Проверить' }).click()
  await expect(page.getByText('Проверьте основание функции и сначала сравните показатели.')).toBeVisible()
  await expect(page.getByRole('button', { name: '2 из 8: текущий, решён' })).toHaveClass(/is-solved/)
})

test('exercise completes only after all its subpoints are solved', async ({ page }) => {
  const answers = ['less', 'less', 'greater', 'greater', 'less', 'less', 'less', 'less']

  for (let index = 0; index < answers.length; index += 1) {
    await page.getByRole('button', { name: new RegExp(`^${index + 1} из 8:`) }).click()
    await page.getByLabel('Знак сравнения').selectOption(answers[index])
    await page.getByRole('button', { name: 'Проверить' }).click()
    if (index < 3) {
      await expect(page.getByLabel('Упражнение 11.17: не завершено')).toBeVisible()
    }
    if (index >= 4 && index < 7) {
      await expect(page.getByLabel('Упражнение 11.18: не завершено')).toBeVisible()
    }
    if (index === 3) await expect(page.getByLabel('Упражнение 11.17: завершено')).toBeVisible()
  }

  await expect(page.getByLabel('Упражнение 11.18: завершено')).toBeVisible()
  await openBookTree(page)
  await expect(page.getByRole('button', { name: '§11. Показательная функция, её свойства и график — ⚖️ Сравните значения функции' })).toHaveClass(/is-complete/)
})

for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
  test(`book tree and content scroll independently without overflow at ${viewport.width} px`, async ({ page }) => {
    await page.setViewportSize(viewport)
    await page.goto('/?section=11&page=theory')
    const content = page.getByTestId('book-content')
    const closedX = (await content.boundingBox())?.x

    await openBookTree(page)
    const openX = (await content.boundingBox())?.x
    expect(openX).toBeGreaterThan(closedX ?? 0)

    const dimensions = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }))
    expect(dimensions.scrollWidth).toBe(dimensions.clientWidth)

    const scrollPositions = await page.evaluate(() => {
      const tree = document.querySelector<HTMLElement>('[aria-label="Дерево книги"]')!
      const material = document.querySelector<HTMLElement>('[data-testid="book-content"]')!
      tree.scrollTop = tree.scrollHeight
      material.scrollTop = material.scrollHeight
      const materialScrollTop = material.scrollTop
      tree.scrollTop = 0
      return {
        treeCanScroll: tree.scrollHeight > tree.clientHeight,
        materialCanScroll: material.scrollHeight > material.clientHeight,
        materialScrollTop,
        materialScrollAfterTreeMoved: material.scrollTop,
      }
    })
    expect(scrollPositions.treeCanScroll).toBe(true)
    expect(scrollPositions.materialCanScroll).toBe(true)
    expect(scrollPositions.materialScrollTop).toBeGreaterThan(0)
    expect(scrollPositions.materialScrollAfterTreeMoved).toBe(scrollPositions.materialScrollTop)

    await page.getByRole('button', { name: 'Закрыть дерево книги' }).click()
    await expect(page.getByRole('navigation', { name: 'Дерево книги' })).not.toBeInViewport()
    await expect(page.getByRole('button', { name: 'Открыть дерево книги' })).toBeVisible()
  })
}
