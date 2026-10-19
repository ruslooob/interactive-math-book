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
  await expect(page.getByText('0 из 284 решено')).toBeVisible()
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

  const practicePage = tree.getByRole('button', { name: '§11. Показательная функция, её свойства и график — 🧮 Найдите значение выражения' })
  await expect(practicePage).not.toHaveClass(/is-complete/)
  await expect(practicePage).toHaveCSS('border-left-width', '0px')
  await practicePage.click()
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

  await page.goto('/?section=11&page=find-integer-values')
  await pagination.getByRole('button', { name: '§12. Показательные уравнения' }).click()
  await expect(page).toHaveURL(/section=12&page=theory/)
  await pagination.getByRole('button', { name: '🔢 Найдите целые значения' }).click()
  await expect(page).toHaveURL(/section=11&page=find-integer-values/)
})

test('legacy contents route opens the book without breadcrumbs', async ({ page }) => {
  await page.goto('/?view=contents')
  await expect(page).toHaveURL(/section=11&page=theory/)
  await expect(page.getByRole('navigation', { name: 'Положение в книге' })).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Оглавление' })).toHaveCount(0)
  await expect(page.getByRole('heading', { name: '§11. Показательная функция, её свойства и график' })).toBeVisible()
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
