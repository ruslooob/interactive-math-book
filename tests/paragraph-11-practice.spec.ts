import { expect, test, type Page } from '@playwright/test'

const practiceUrl = '/?section=11&page=compare-values'

async function openBookTree(page: Page) {
  const button = page.getByRole('button', { name: 'Открыть дерево книги' })
  await button.click()
  await expect(page.getByRole('button', { name: 'Закрыть дерево книги' })).toHaveAttribute('aria-expanded', 'true')
  await expect(page.getByRole('navigation', { name: 'Дерево книги' })).toBeInViewport()
}

test.beforeEach(async ({ page }) => {
  await page.goto(practiceUrl)
  await page.evaluate(() => window.localStorage.clear())
  await page.reload()
})

test('теория и практическая страница §11 открываются независимо через дерево книги', async ({ page }) => {
  await expect(page.getByRole('heading', { name: '⚖️ Сравните значения функции' })).toBeVisible()
  await expect(page.getByText('68 из 282 решено')).toBeVisible()
  await openBookTree(page)

  const tree = page.getByRole('navigation', { name: 'Дерево книги' })
  await expect(tree.getByText('Алгебра и начала математического анализа. 11 класс')).toBeVisible()
  await expect(tree.getByText(/^Глава /)).toHaveCount(6)
  await expect(tree.getByText(/Упражнение 11\.17/)).toHaveCount(0)

  await tree.getByRole('button', { name: '📖 Теория' }).click()
  await expect(page).toHaveURL(/section=11&page=theory/)
  await expect(page.getByRole('heading', { name: '§11. Показательная функция, её свойства и график' })).toBeVisible()

  await openBookTree(page)
  const completedPage = tree.getByRole('button', { name: '🧮 Найдите значение выражения' })
  await expect(completedPage).toHaveClass(/is-complete/)
  await completedPage.click()
  await expect(page).toHaveURL(/section=11&page=calculate-expression/)
  await expect(page.getByRole('heading', { name: '🧮 Найдите значение выражения' })).toBeVisible()

  await openBookTree(page)
  await tree.getByRole('button', { name: '⚖️ Сравните значения функции' }).click()
  await expect(page).toHaveURL(/section=11&page=compare-values/)
})

test('правильный ответ закрепляет прогресс при переходах, перезагрузке и повторном решении', async ({ page }) => {
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

test('упражнение завершается только после решения всех его подпунктов', async ({ page }) => {
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
  await expect(page.getByRole('button', { name: '⚖️ Сравните значения функции' })).toHaveClass(/is-complete/)
})

for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
  test(`дерево сдвигает рабочую область и не создаёт переполнение при ширине ${viewport.width} px`, async ({ page }) => {
    await page.setViewportSize(viewport)
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

    await page.getByRole('button', { name: 'Закрыть дерево книги' }).click()
    await expect(page.getByRole('navigation', { name: 'Дерево книги' })).not.toBeInViewport()
    await expect(page.getByRole('button', { name: 'Открыть дерево книги' })).toBeVisible()
  })
}
