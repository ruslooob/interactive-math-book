import { expect, test } from '@playwright/test'

test.use({ viewport: { width: 1440, height: 900 } })

test('one page pair visits all 25 exercises and continues to section 12', async ({ page }) => {
  await page.goto('/?section=11&page=theory')
  const pagination = page.getByRole('navigation', { name: 'Переход между страницами книги' })
  await pagination.getByRole('button', { name: 'Следующая страница: Упражнение 11.1', exact: true }).click()
  for (let number = 1; number <= 25; number += 1) {
    await expect(page).toHaveURL(new RegExp(`exercise=11\\.${number}(?:&|$)`))
    await expect(page.getByRole('heading', { name: new RegExp(`^Упражнение 11\\.${number}(?: · а)?$`) })).toBeVisible()
    await expect(pagination.getByRole('button')).toHaveCount(2)
    await expect(page.getByRole('button', { name: /^Предыдущая/ })).toHaveCount(1)
    await expect(page.getByRole('button', { name: /^Следующая/ })).toHaveCount(1)
    await expect(page.getByTestId('book-content').getByText(/^\d+ из \d+$/)).toHaveCount(0)
    await expect(page.locator('.exercise-navigation')).toHaveCount(0)
    await pagination.getByRole('button', { name: /^Следующая страница:/ }).click()
  }
  await expect(page).toHaveURL(/section=12&page=theory/)
  await pagination.getByRole('button', { name: 'Предыдущая страница: Упражнение 11.25', exact: true }).click()
  await expect(page).toHaveURL(/exercise=11.25/)
  await page.goBack()
  await expect(page).toHaveURL(/section=12&page=theory/)
})

test('keyboard navigation crosses group boundaries and returns to theory', async ({ page }) => {
  for (const [group, from, to] of [
    ['calculate-expression', '11.7', '11.8'],
    ['find-function-value', '11.12', '11.13'],
    ['draw-graph', '11.16', '11.17'],
  ]) {
    await page.goto(`/?section=11&page=${group}&exercise=${from}`)
    await page.getByRole('button', { name: `Следующая страница: Упражнение ${to}`, exact: true }).focus()
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(new RegExp(`exercise=${to.replace('.', '\\.')}`))
    await page.getByRole('button', { name: `Предыдущая страница: Упражнение ${from}`, exact: true }).focus()
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(new RegExp(`exercise=${from.replace('.', '\\.')}`))
  }
  await page.goto('/?section=11&page=calculate-expression')
  await page.getByRole('button', { name: /^Предыдущая страница:/ }).focus()
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/section=11&page=theory/)
  await page.goto('/?section=11&page=study-monotonicity&exercise=11.26')
  await expect(page.getByRole('button', { name: 'Проверить', exact: true })).toHaveCount(0)
})

test('solved selectors and tree indicators retain accessible status after replay and reload', async ({ page }, testInfo) => {
  await page.goto('/?section=11&page=calculate-expression&exercise=11.1')
  for (const [letter, answer] of [['а', '32'], ['б', '343'], ['в', '3'], ['г', '27/64']]) {
    await page.getByRole('button', { name: `Часть ${letter}`, exact: true }).click()
    await page.getByRole('textbox', { name: 'Ответ', exact: true }).fill(answer)
    await page.getByRole('button', { name: 'Проверить', exact: true }).click()
    await expect(page.getByRole('button', { name: `Часть ${letter} — решено`, exact: true })).toHaveText(letter)
  }
  await page.getByRole('button', { name: 'Решить ещё раз' }).click()
  await page.getByRole('textbox', { name: 'Ответ', exact: true }).fill('0')
  await page.getByRole('button', { name: 'Проверить', exact: true }).click()
  await page.reload()
  await expect(page.getByText('4 из 284 решено')).toBeVisible()
  const solved = page.getByRole('button', { name: 'Часть а — решено', exact: true })
  await expect(solved).toHaveAttribute('aria-current', 'step')
  await page.getByRole('button', { name: 'Часть б — решено', exact: true }).focus()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('button', { name: 'Часть б — решено', exact: true })).toBeFocused()
  await page.screenshot({ path: testInfo.outputPath('solved-focus.png') })
  await page.getByRole('button', { name: 'Открыть дерево книги' }).click()
  const treeExercise = page.getByRole('button', { name: 'Упражнение 11.1 — решено', exact: true })
  await expect(treeExercise).toHaveText('Упражнение 11.1')
  await page.screenshot({ path: testInfo.outputPath('solved-tree.png') })
  await page.getByRole('button', { name: 'Закрыть дерево книги' }).click()
  await page.goto('/?section=11&page=compare-values&exercise=11.17')
  await page.getByRole('button', { name: 'Меньше', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Часть а — решено', exact: true })).toHaveText('а')
  await page.getByRole('button', { name: 'Решить снова' }).click()
  await page.getByRole('button', { name: 'Равно', exact: true }).click()
  await page.reload()
  await expect(page.getByText('5 из 284 решено')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Часть а — решено', exact: true })).toHaveText('а')
  await page.screenshot({ path: testInfo.outputPath('solved-comparison.png') })
})
