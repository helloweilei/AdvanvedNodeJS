const { createUser } = require('./factories/user');
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

describe('When logged in', () => {
  beforeEach(async () => {
    await page.login(await createUser());
    await page.click('a.btn-floating');
  });

  test('show new blog form', async () => {
    const label = await page.getContentOf('form label');
    expect(label).toEqual('Blog Title');
  });

  describe('when input is valid', async () => {
    beforeEach(async () => {
      await page.type('.title input', 'My title');
      await page.type('.content input', 'My content');
      await page.click('button[type=submit]');
    });

    test('show preview page', async () => {
      const text = await page.getContentOf('form h5');
      expect(text).toEqual('Please confirm your entries');
    });

    test('create blog', async () => {
      await page.click('button.green');
      await page.waitFor('.card');
      const title = await page.getContentOf('.card-title');
      expect(title).toEqual('My title');
    });
  });

  describe('when input is invalid', async () => {
    beforeEach(async () => {
      await page.click('button[type=submit]');
    });
    test('show error message', async() => {
      const text = await page.getContentOf('.red-text');
      expect(text).toEqual('You must provide a value');
    });
  });
});



