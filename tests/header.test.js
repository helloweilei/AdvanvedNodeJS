const CustomPage = require('./helper');
const { getUser } = require('./setup');

jest.setTimeout(5000);

let page;

beforeEach(async () => {
  page = await CustomPage.build();
  await page.goto('http://localhost:3000');
});

afterEach(async () => {
  await page.browser.close();
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

test('sign in', async () => {
  await page.login(getUser());
  const text = await page.getContentOf('a[href="/auth/logout"]');
  console.log(text);
  expect(text).toEqual('Logout');
});