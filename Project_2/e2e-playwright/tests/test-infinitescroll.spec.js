const { test, expect } = require('@playwright/test')

test('After scrolling to end of page, more questions are loaded', async ({
  page,
}) => {
  await page.goto('/')
  await page.click('a:has-text("Intro to SQL")')
  const title = await page.waitForSelector('h1[id=course-title]') // Check title of the course
  expect(await title.innerText()).toContain('Course: Intro to SQL')
  expect(await page.locator('div[id=questionlist] > div').count()).toBe(21)

  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight)
  })
  await page.waitForTimeout(500)
  expect(await page.locator('div[id=questionlist] > div').count()).not.toBe(21)
})
