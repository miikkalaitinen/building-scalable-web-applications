const { test, expect } = require('@playwright/test')

test('Server responds with a page with the title "Welcome to Aalto University Q&A site"', async ({
  page,
}) => {
  await page.waitForTimeout(500)
  await page.goto('')
  const titlebox = await page.waitForSelector('h1[id=list-title]')
  expect(await titlebox.innerText()).toBe(
    'Welcome to Aalto University Q&A site'
  )
  await page.close()
})
