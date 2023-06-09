const puppeteer = require('puppeteer');
const sessionFactory = require('./factories/session');

class CustomPage {
  static async build() {
    const browser = await puppeteer.launch({ headless: false });
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

    await this.page.goto('localhost:3000');
    await this.page.waitFor('a[href="/auth/logout"]');
  }

  getContentOf(selector) {
    return this.page.$eval(selector, el => el.innerHTML);
  }
}

module.exports = CustomPage;