const cheerio = require("cheerio");

export class Scraper {
  async getOffers(page, product, priceTarget) {
    // page.reload(); //verify if there's a way to prevent this
    let html = await page.evaluate(() => document.body.innerHTML);
    console.log(`I RECEIVE THE HTML`);
    console.log(html);
    const $ = cheerio.load(html);
    let offerList = [];
    $("#aod-offer-list", html).each((id, item) => {
      const list = $(item);
      const offer = list.find("#aod-offer");
      console.log(`THIS IS HTE Offer`);
      console.log(offer);
      offer.each((index, row) => {
        let seller = $(row).find("#aod-offer-soldBy");
        const provider = $(seller)
          .find("div.a-fixed-left-grid-col.a-col-right")
          .text();
        if (provider.trim() === "Amazon Warehouse") {
          let buttonDiv = $(row).find(
            "div.a-fixed-right-grid-col.aod-atc-column.a-col-right",
          );
          let offerElement = $(buttonDiv).find("span.a-declarative");
          const offerAttribute = offerElement[0].attribs["data-aod-atc-action"];
          const offerPrice = parseFloat(
            $(row)
              .find("span.a-offscreen")
              .text()
              .substring(1)
              .replace(",", ""),
          );
          const offerID = JSON.parse(offerAttribute).oid;
          if (offerPrice < priceTarget)
            offerList.push({
              price: offerPrice,
              seller: "Amazon Warehouse",
              offerID: offerID,
              ASIN: product,
              checkoutUrl: `https://smile.amazon.com/gp/checkoutportal/enter-checkout.html?buyNow=1&skipCart=1&offeringID=${offerID}&quantity=1`,
            });
        }
      });
    });
    console.log(`Offerlist`, offerList);
    return offerList;
  }
}