const { test, expect } = require('@playwright/test')

test('Questions are sorted correctly after upvote', async ({ page }) => {
  await page.goto('/course/1')
  const fifthquestion = await page.locator('div[id=questionlist] div >> nth=5')
  const fifthquestionhandle = await fifthquestion.locator('h1').elementHandle()
  const fifthquestiontext = await fifthquestionhandle.innerText()
  const fifthquestionbutton = await fifthquestion.locator('img[alt=upvote]')
  await fifthquestionbutton.click()

  await page.waitForTimeout(500)
  await page.goto('/course/1')
  const firstquestionafter = await page
    .locator('div[id=questionlist] div >> nth=0')
    .locator('h1')
    .elementHandle() // Get the ElementHandle object
  const firstquestionaftertext = await firstquestionafter.innerText()
  expect(fifthquestiontext).toBe(firstquestionaftertext)
  await page.close()
})
