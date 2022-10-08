const chromium = require("chrome-aws-lambda");
require('dotenv/config');
export class Browser {
	constructor(browser) {
		this.browser = browser;
	}
	async getPage(product) {
		const url = `https://smile.amazon.com/dp/${product}?aod=1`;
		let page = await this.browser.newPage();
		console.log(`AFTER PAGE`);
		await page.goto(url, { waitUntil: 'load' });
		console.log(`AFTER PAGE GOTO`);
		return page;
	}

	static async build() {
		const executablePath =
			process.env.NODE_ENV === 'local'
				? process.env.CHROMIUM_PATH
				: await chromium.executablePath;

		return await chromium.puppeteer.launch({
			args: chromium.args,
			defaultViewport: chromium.defaultViewport,
			executablePath,
			headless: chromium.headless,
		});
	}
}
