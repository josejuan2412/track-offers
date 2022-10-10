import { Webhook } from 'discord-webhook-client';
import RawEmbed from 'discord-raw-embed';

export async function discordNotification(
	discordId,
	discordToken,
	asin,
	price,
	title,
	checkoutUrl
) {
	const webhook = new Webhook({
		id: discordId,
		token: discordToken,
	});
	const embed = new RawEmbed();
	embed.setColor(0x0099ff);
	embed.setTitle(`[$${price}] - ${title}`);
	embed.setDescription('Warehouse - ASIN tracker');
	embed.setTimestamp(new Date());
	embed.setURL(`https://smile.amazon.com/dp/${asin}?aod=1`);
	embed.addField('Checkout URL: ', checkoutUrl, true);
	embed.getEmbed();
	webhook.send({ embeds: [embed.embed] });
	return null;
}