const { test, expect } = require('@playwright/test')

test('Server accepts new answer and the answer appears without refresh', async ({
  page,
}) => {
  await page.goto('/question/1')
  await page.click('button:has-text("Add Answer")')
  await page.fill('textarea[id=answerarea]', 'Hola amigos!')
  await page.click('button:has-text("Send Answer")')

  await page.waitForTimeout(500)
  const firstquestionafter = await page.locator(
    'div[id=answerlist] div >> nth=1'
  )
  expect(await firstquestionafter.innerText()).toContain('Hola amigos!')
  await page.close()
})
