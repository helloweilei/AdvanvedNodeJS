const { getUser } = require('./setup');
const CustomPage = require('./helper');

jest.setTimeout(30000);

let page;

beforeEach(async () => {
  page = await CustomPage.build();
  await page.goto('localhost:3000');
});

afterEach(async () => {
  await page.browser.close();
});


