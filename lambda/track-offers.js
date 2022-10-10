import { Scraper } from '../scraper/scraper';
import { Browser } from '../scraper/browser';
import { DynamoDb } from '../db/db';
// import { discordNotification } from '../notifications/discord';

export async function trackOffers({ browser, asin, price, description }) {
	const newBrowser = new Browser(browser);
	const scraper = new Scraper();
	const dynamoDb = new DynamoDb();
	const page = await newBrowser.getPage(asin);
	const offers = await scraper.getOffers(page, asin, price);
	if (page) {
		page.close();
	}
	console.log(`Total of offers: ${offers.length} for this asin: "${asin}"`);
	if (offers.length > 0) {
		for (const offer of offers) {
			const offerExist = await dynamoDb.getOffer(asin, offer.price);
			if (!offerExist) {
				/*await discordNotification(
					process.env.DISCORD_ID,
					process.env.DISCORD_TOKEN,
					asin,
					offer.price,
					description,
					offer.checkoutUrl
				);*/
				await dynamoDb.upsertOffer({
					asin,
					price: offer.price,
					offerId: offer.offerID,
					checkoutUrl: offer.checkoutUrl,
				});
			} else {
				console.log(`The offer exist`);
			}
		}
	}
	return { offers };
}
