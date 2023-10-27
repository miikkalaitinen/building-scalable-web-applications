const { test, expect } = require('@playwright/test')

test('Navigating to SQL Course, returns course with 20 questions', async ({
  page,
}) => {
  await page.goto('/')
  await page.click('a:has-text("Intro to SQL")')
  const title = await page.waitForSelector('h1[id=course-title]') // Check title of the course
  expect(await title.innerText()).toContain('Course: Intro to SQL')
  expect(await page.locator('div[id=questionlist] > div').count()).toBe(21)
  await page.close()
})
