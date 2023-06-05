const puppeteer = require('puppeteer');

jest.setTimeout(30000);

let browser, page;

beforeEach(async () => {
  browser = await puppeteer.launch({
    headless: false
  });
  page = await browser.newPage();
  await page.goto('localhost:3000');
});

afterEach(async () => {
  await browser.close();
});

test('Header is set correctly', async () => {
  const text = await page.$eval('a.brand-logo', e => e.innerHTML);
  expect(text).toEqual('Blogster');
});

test('Jump to auto page', async () => {
  await page.click('.right a');
  const url = await page.url();

  expect(url).toMatch(/accounts\.google\.com/);
});