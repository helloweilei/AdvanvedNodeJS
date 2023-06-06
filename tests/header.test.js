const puppeteer = require('puppeteer');
const KeyGrip = require('keygrip');
const Buffer = require('safe-buffer').Buffer;

const keys = require('../config/keys');

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

test('sign in', async () => {
  const userId = '6476adc8811cf12e9effe911';
  const sessionString = Buffer.from(JSON.stringify({
    passport: { user: userId },
  })).toString('base64');

  const keyGrip = new KeyGrip([keys.cookieKey]);
  const sig = keyGrip.sign(`session=${sessionString}`);

  await page.setCookie({
    name: 'session', value: sessionString,
  }, {
    name: 'session.sig', value: sig,
  });

  await page.goto('localhost:3000');
  await page.waitFor('a[href="/auth/logout"]');
  const text = await page.$eval('a[href="/auth/logout"]', el => el.innerHTML);

  expect(text).toEqual('Logout');
});