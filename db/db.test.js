import {writeFileSync} from 'fs';
const { DynamoDb } = require("./db");

describe.only("DynamoDb", () => {
  beforeEach(() => {
    jest.setTimeout(60000);
  });
  test("Get the products", async () => {
    const dynamoDb = new DynamoDb();
    const products = await dynamoDb.getProducts();
    expect(products.length).toBeGreaterThan(0);
  });
  test("Get the product offer", async () => {
    const dynamoDb = new DynamoDb();
    const offers = await dynamoDb.getOffers("B08WC6VDM5");
    expect(offers.length).toBeGreaterThan(0);
  });
  test("Get Offer of a product", async () => {
    const dynamoDb = new DynamoDb();
    const offer = await dynamoDb.getOffer("B08WC6VDM5", 29.99);
    expect(offer).toBeDefined();
  });
  test("Upsert product", async () => {
    const dynamoDb = new DynamoDb();
    const offer = {
      asin: "B08WC6VDM5",
      price: 29.99,
      offerId: "123123123",
      checkoutUrl: "https://google.com",
    };
    const response = await dynamoDb.upsertOffer(offer);
    expect(response.asin).toBe(offer.asin);
  });
});
