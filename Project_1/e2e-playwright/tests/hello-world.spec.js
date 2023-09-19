const { test, expect } = require('@playwright/test')

test("Server responds with a page with the title 'Programming assignments'", async ({
  page,
}) => {
  await page.waitForTimeout(7000) // To make sure grader-api is up and running
  await page.goto('')
  expect(await page.title()).toBe('Programming assignments')
  await page.close()
})

test('Server fails an incorrect submission', async ({ page }) => {
  await page.goto('/')
  await page.fill('textarea[id=textbox]', 'def hello():\n\treturn "Hi"')
  await page.click('button:has-text("Grade my code")')
  const feedback = await page.waitForSelector('div[id=tracebackbox]')
  expect(await feedback.innerText()).toContain('FAIL: test_hello')
  await page.close()
})

test('Server passes a correct submission', async ({ page }) => {
  await page.goto('/')
  await page.fill('textarea[id=textbox]', 'def hello():\n\treturn "Hello"')
  await page.click('button:has-text("Grade my code")')
  const feedback = await page.waitForSelector('div[id=tracebackbox]')
  expect(await feedback.innerText()).toContain('OK')
  await page.close()
})

test('Server passes a correct submission and proceed to the next one', async ({
  page,
}) => {
  await page.goto('/')
  await page.fill('textarea[id=textbox]', 'def hello():\n\treturn "Hello"')
  await page.click('button:has-text("Grade my code")')
  const feedback = await page.waitForSelector('div[id=tracebackbox]')
  expect(await feedback.innerText()).toContain('OK')

  await page.click('button:has-text("Next assignment")')

  const handout = await page.waitForSelector('p[id=handout]')
  expect(await handout.innerText()).toContain(
    'Write a function "hello" that returns the string "Hello world!"'
  )
  await page.close()
})

test('User gets points on right answer, and no points on a wrong one', async ({
  page,
}) => {
  test.setTimeout(30000)
  await page.goto('/')

  let points = await page.waitForSelector('p[id=points]')
  expect(await points.innerText()).toContain('Your points: 0/300')

  await page.fill('textarea[id=textbox]', 'def hello():\n\treturn "Hi"')
  await page.click('button:has-text("Grade my code")')
  let feedback = await page.waitForSelector('div[id=tracebackbox]')
  expect(await feedback.innerText()).toContain('FAIL: test_hello')
  points = await page.waitForSelector('p[id=points]')
  expect(await points.innerText()).toContain('Your points: 0/300')

  await page.click('button:has-text("Close feedback and try again")')
  await page.fill('textarea[id=textbox]', 'def hello():\n\treturn "Hello"')
  await page.click('button:has-text("Grade my code")')
  feedback = await page.waitForSelector('div[id=tracebackbox]')
  expect(await feedback.innerText()).toContain('OK')

  points = await page.waitForSelector('p[id=points]')
  expect(await points.innerText()).toContain('Your points: 100/300')
  await page.close()
})
