import { Browser } from '../../scraper/browser';
import { trackOffers } from '../../lambda/track-offers';
export default async function handler(req, res) {
	if (req.method !== 'POST') {
		res.status(405).send({ message: 'Only POST requests allowed' });
		return;
	}
	try {
		await run(req.body);
		res.status(200).json({ success: true });
	} catch (e) {
		console.error(e);
		res.status(500).json({ message: e.message });
	}
}

async function run({ asin, price, description }) {
	console.log(`SETUP BROWSER`);
	const browser = await Browser.build();
	console.log(`SUCCESS SETTING UP BROWSER`);
	await trackOffers({ browser, asin, price, description });
}
