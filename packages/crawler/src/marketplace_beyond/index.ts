import {BrowserName, Dataset, DeviceCategory, OperatingSystemsName, PlaywrightCrawler} from "crawlee";
import {getAttributeValue, getTextContent, MarketPlaceLabel, scrollToAndWaitForSelector} from "../util/index.js";
import {Params} from "../types.js";

export async function enqueueProductDetailPage({page}: Pick<Params, 'page'>) {
  await page.waitForSelector('h1.product_name');

  // General Info
  const [title, currency, price] = await Promise.all([
    getTextContent(page, 'h1.product_name'),
    getAttributeValue(page, 'span.money', 'data-currency'),
    getTextContent(page, '.price-ui > .price > span.money'),
  ]);

  // Description from the first 'page' block
  const description = await page.$$eval('.page[title="Page 1"] .layoutArea p', paragraphs =>
    paragraphs.map(p => p.textContent.trim()).join('\n')
  );

  // Description_2 from the second 'page' block
  const description_2 = await page.$$eval('.page[title="Page 2"] .layoutArea p', paragraphs =>
    paragraphs.map(p => p.textContent.trim()).join('\n')
  );

  // Extracting image details
  const images = await page.$$eval('.thumb_variant_img img', (imgs) => {
    return imgs.map((img) => {
      // Extracting the original source, alt text, title, and image ID from each image
      const oriSrc = 'https:' + img.parentElement.getAttribute('data-ori-src');
      const alt = img.alt;
      const title = img.parentElement.getAttribute('data-title');
      const imageId = img.getAttribute('data-image-id');

      return {oriSrc, alt, title, imageId};
    });
  });

  await scrollToAndWaitForSelector(page, '.product-recommendations');
  const recommendedProducts = await page.$$eval('.gallery-cell', (products) => {
    return products.map((product) => {
      console.log({PRODUCT: product.innerHTML})
      const imageElement = product.querySelector('.image__container .image-element__wrap img');
      const imageUrl = imageElement ? 'https:' + imageElement.dataset.src : '';
      const productName = product.querySelector('.product-details span.title.product-title-height')?.textContent?.trim() ?? '';
      const priceDetails = product.querySelector('.product-details span.price span.current_price span.money')
      const currency = priceDetails?.getAttribute('data-currency');
      const price = priceDetails?.getAttribute('data-currency-amount-convert');
      // const price = priceElement ? priceElement.textContent.trim() : '';

      return {productName, image: imageUrl, price, currency};
    });
  })
  recommendedProducts.filter((val) => val.productName !== '' && val.currency && val.price && val.image !== '')
  const results = {
    title,
    currency,
    price,
    description,
    description_2,
    images,
    recommendedProducts: recommendedProducts.filter((val) => val.productName !== '' && val.currency && val.price && val.image !== '')
  }

  return results
}

export async function enqueueCategoryDetailsPage({page, enqueueLinks}: Params) {
  const results = await enqueueProductDetailPage({page})

  console.log('🚀🚀 🚀  Got it! Storing product: ', results.title)
  const data = await Dataset.open('beyond-batch');
  await data.pushData(results);

  await data.exportToJSON('beyond-batch-1')

  const categoriesListSelector = '.one-third > a.product-info__caption'
  const hasNextPage = await page.$(categoriesListSelector);
  if (hasNextPage) {
    await enqueueLinks({
      selector: categoriesListSelector,
      label: MarketPlaceLabel.CATEGORY
    }).then(re => console.log('running'))
      .catch(err => console.log('error', err))
  }
}

export async function enqueueCategoryPage({page, enqueueLinks}: Params) {
  const selectorCategoryPage = '.one-third > a.product-info__caption'
  await page.waitForSelector(selectorCategoryPage)

  await enqueueLinks({
    label: MarketPlaceLabel.CATEGORY,
    selector: selectorCategoryPage
  })
}

export const beyondUrl = 'https://www.beyondthevines.com/collections/womens-new-in'

export const beyondCrawler = {
  // @ts-ignore
  browserPoolOptions: {
    useFingerprints: true, // this is the default
    fingerprintOptions: {
      fingerprintGeneratorOptions: {
        browsers: [{
          name: BrowserName.edge,
          minVersion: 96,
        }],
        devices: [
          DeviceCategory.desktop,
        ],
        operatingSystems: [
          OperatingSystemsName.windows,
        ],
      },
    },
  },
  requestHandler: async ({page, request, enqueueLinks}) => {
    console.log(`Processing: ${request.url}`);

    if (request.label === MarketPlaceLabel.CATEGORY) {
      await enqueueCategoryDetailsPage({page, enqueueLinks})
    } else {
      await enqueueCategoryPage({page, enqueueLinks})
    }
  },
  maxRequestsPerCrawl: 40, // Limit the number of requests to prevent infinite crawling in large sites,
  // headless: false
} satisfies PlaywrightCrawler