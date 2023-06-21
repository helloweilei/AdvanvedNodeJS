const puppeteer = require('puppeteer');
const sessionFactory = require('./factories/session');

class CustomPage {
  static async build() {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox']
    });
    const page = await browser.newPage();

    const customPage = new CustomPage(page);
    return new Proxy(customPage, {
      get: function(target, property) {
        if (property === 'browser') {
          return browser;
        }
        return target[property] || page[property];
      }
    });
  }

  constructor(page) {
    this.page = page;
  }

  async login(user) {
    const {session, sig} = sessionFactory(user);

    await this.page.setCookie({name: 'session', value: session});
    await this.page.setCookie({name: 'session.sig', value: sig});

    await this.page.goto('http://localhost:3000/blogs');
    await this.page.waitFor('a[href="/auth/logout"]');
  }

  getContentOf(selector) {
    return this.page.$eval(selector, el => el.innerHTML);
  }

  post(path, data) {
    return this.page.evaluate(async (_path, _data) => {
      return fetch(_path, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(_data),
      }).then(res => {
        return res.json();
      });
    }, path, data);
  }
}

module.exports = CustomPage;