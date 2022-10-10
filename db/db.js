import { DynamoDBClient, BatchExecuteStatementCommand, ScanCommand } 
	from "@aws-sdk/client-dynamodb";
import { DateTime } from 'luxon';

require('dotenv/config');

export class Db {
	async getProducts() {
		throw new Error('getOffers method not implemented');
	}

	async getOffers(id) {
		throw new Error('getOffers method not implemented', id);
	}

	async upsertOffer(offer) {
		throw new Error('getOffers method not implemented', offer);
	}
}

export class DynamoDb extends Db {
	db = null;
	constructor() {
		super();
		this.config = {
			region: process.env.DEFAULT_REGION,
			apiVersion: '2012-08-10',
			credentials: {
				accessKeyId: process.env.ACCESS_KEY_ID,
				secretAccessKey: process.env.SECRET_ACCESS_KEY,
			}
		};
		
		this.db = new DynamoDBClient(this.config);
	}

	async getProducts() {
		var params = {
			TableName: 'Products',
			FilterExpression: 'blacklist = true',
			ExpressionAttributeValues: {
				':blacklist': {
					BOOL: false,
				},
			},
		};
		const command = new ScanCommand({
			TableName: 'Products',
			FilterExpression: 'blacklist = true',
		});
		console.log(`CONFIGURATION`, this.config)
		const result =  this.db.send(command);
		return 
		/*var result = await this.db.scan(params).promise();
		return result.Items.map(this.mapProduct) || [];*/
	}
	async getOffers(id) {
		var params = {
			TableName: 'Offers',
			KeyConditionExpression: 'asin = :asin',
			ExpressionAttributeValues: {
				':asin': {
					S: id,
				},
			},
		};
		var result = await this.db.query(params).promise();
		return result.Items.map(this.mapOffers) || [];
	}

	async getOffer(asin, price) {
		var params = {
			TableName: 'Offers',
			KeyConditionExpression: 'asin = :asin and price = :price',
			ExpressionAttributeValues: {
				':asin': {
					S: asin,
				},
				':price': {
					N: `${price}`,
				},
			},
		};
		var result = await this.db.query(params).promise();
		if (result.Items.length) {
			return result.Items.map(this.mapOffers)[0];
		}
		return null;
	}

	async upsertOffer(offer) {
		const { asin, price, offerId, checkoutUrl } = offer;

		/* If TTL is set propertly the code below is not required
    const previousOffer = await this.getOffer(asin, price);
    if (previousOffer) {
      return previousOffer;
    }*/

		const secondsToExpire = 10;
		const expireAt = Math.trunc(
			DateTime.now().plus({ seconds: secondsToExpire }).toSeconds()
		);
		var params = {
			TableName: 'Offers',
			Item: {
				asin: { S: asin },
				price: { N: `${price}` },
				offer_id: { S: offerId },
				checkout_url: { S: checkoutUrl },
				expire_at: { N: `${expireAt}` },
			},
		};

		await this.db.putItem(params).promise();

		return offer;
	}

	mapProduct(item) {
		const { asin, description, created_at, price } = item;
		return {
			asin: asin.S,
			description: description.S,
			createdAt: new Date(created_at.S),
			price: parseFloat(`${price.N}`),
		};
	}

	mapOffers(item) {
		const { asin, price, offer_id, checkout_url, expire_at } = item;
		return {
			asin: asin.S,
			price: parseFloat(`${price.N}`),
			offerId: offer_id ? offer_id.S : undefined,
			checkoutUrl: checkout_url ? checkout_url.S : undefined,
			expireAt: expire_at ? parseFloat(`${expire_at.N}`) : undefined,
		};
	}
}
