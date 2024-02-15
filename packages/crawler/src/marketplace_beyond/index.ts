import {Dataset, PlaywrightCrawler} from "crawlee";
import {
  getAttributeValue,
  getFulfilledValue,
  getTextContent,
  MarketPlaceLabel,
  scrollToAndWaitForSelector
} from "../util/index.js";
import {Params, ProductsResults} from "../types.js";
import {defaultBrowserPoolOptions} from "../util/constant.js";

async function enqueueProductDetailPage({page}: Pick<Params, 'page'>) {
  await page.waitForSelector('h1.product_name');

  // General Info
  const generalInfo = await Promise.allSettled([
    getTextContent(page, 'h1.product_name'),
    getAttributeValue(page, 'span.money', 'data-currency'),
    getTextContent(page, '.price-ui > .price > span.money'),
  ]);

  const [title, currency, price] = generalInfo.map(result => getFulfilledValue(result));

  // Description from the first 'page' block
  let description = ''
  try {
    await page.click('ul.tabs > li:nth-of-type(1)')

    await page.waitForSelector('.everett-light-r > .description > ul.tabs')

    description = await page.$$eval('ul.tabs-content > li#tab1', paragraphs =>
      paragraphs.map(p => p.innerText?.trim() || '')
    );
  } catch (error) {
    console.log(`Error, description`, error)
  }

  let washcare = null
  try {

    await page.click('ul.tabs > li:nth-of-type(2)', {timeout: 50000})

    await page.waitForSelector('.everett-light-r > .description > ul.tabs', {timeout: 50000})

    washcare = await page.$$eval('ul.tabs-content > li#tab2', paragraphs =>
      paragraphs.map(p => p?.innerText.trim() || '')
    );
  } catch (error) {
    console.log(`Error, description__2`, error)
  }

  // Extracting image details
  let images: string[] = []
  try {
    images = await page.$$eval('.thumb_variant_img img', (imgs) => {
      return imgs.map((img) => {
        const oriSrc = 'https:' + img.parentElement.getAttribute('data-ori-src');

        return oriSrc;
      });
    });
  } catch (error) {
    console.log(`Error, images`, error)
  }

  let recommended: unknown[] = []
  try {
    await scrollToAndWaitForSelector(page, '.product-recommendations');
    recommended = await page.$$eval('.gallery-cell', (products) => {
      return products.map((product) => {
        const imageElement = product.querySelector('.image__container .image-element__wrap img');
        const imageUrl = imageElement ? 'https:' + imageElement.dataset.src : '';
        const productName = product.querySelector('.product-details span.title.product-title-height')?.textContent?.trim() ?? '';
        const priceDetails = product.querySelector('.product-details span.price span.current_price span.money')
        const currency = priceDetails?.getAttribute('data-currency');
        const price = priceDetails?.getAttribute('data-currency-amount-convert');

        return {productName, image: imageUrl, price, currency};
      }).filter(val => val.productName !== '' && val.currency && val.price && val.image !== '');
    })
  } catch (error) {

  }

  const results: ProductsResults = {
    title,
    currency,
    price: {
      currentPrice: price,
    },
    description,
    marketplace: {
      washcare,
    },
    images,
    recommended,
  }

  return results
}

async function enqueueCategoryDetailsPage({page, enqueueLinks}: Params) {
  const results = await enqueueProductDetailPage({page})

  console.log('🚀🚀 🚀  Got it! Storing product: ', {results: results.title})
  const data = await Dataset.open('beyond-batches');
  await data.pushData(results);

  await data.exportToJSON('beyond-batches-1')

  const categoriesListSelector = '.one-third > a.product-info__caption'
  const hasNextPage = await page.$(categoriesListSelector);
  if (hasNextPage) {
    await enqueueLinks({
      selector: categoriesListSelector,
      label: MarketPlaceLabel.CATEGORY
    })
  }
}

async function enqueueCategoryPage({page, enqueueLinks}: Params) {
  const selectorCategoryPage = '.one-third > a.product-info__caption'
  await page.waitForSelector(selectorCategoryPage)

  await enqueueLinks({
    label: MarketPlaceLabel.CATEGORY,
    selector: selectorCategoryPage
  })
}

export const beyondUrl = 'https://www.lovebonito.com/sg/shop/apparel-accessories/blouses-shirts?stock.is_in_stock=true'

export const beyondCrawler = {
  // @ts-ignore
  browserPoolOptions: defaultBrowserPoolOptions,
  requestHandler: async ({page, request, enqueueLinks}) => {
    console.log(`Processing: ${request.url}`);

    if (request.label === MarketPlaceLabel.CATEGORY) {
      await enqueueCategoryDetailsPage({page, enqueueLinks})
    } else {
      await enqueueCategoryPage({page, enqueueLinks})
    }
  },
  maxRequestsPerCrawl: 70, // Limit the number of requests to prevent infinite crawling in large sites,
  // headless: false
} satisfies PlaywrightCrawler