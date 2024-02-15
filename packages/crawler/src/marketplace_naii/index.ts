import {BrowserName, Dataset, DeviceCategory, OperatingSystemsName, PlaywrightCrawler} from "crawlee";
import {Params, ProductsResults} from "../types.js";
import {trim} from "../util/index.js";
import {defaultBrowserPoolOptions} from "../util/constant.js";

async function enqueueProductDetailPage({page}: Params) {
  await page.waitForSelector('.product-details > h1.product-title')
  const coverImg = await page.getAttribute('.product-gallery--image-background > img', 'src');
  const title = await page.locator('.product-details > h1.product-title').textContent() ?? ''
  const price = await page.locator('.product--price > .price--main > span.money > span.money').textContent() ?? ''
  const description = await page.locator('.product-description').innerText()

  const recommendedProducts: unknown[] = []
  const itemCount = await page.locator('ul.product-section--content > li').count();

  for (let i = 0; i < itemCount; i++) {
    const itemData = await Promise.allSettled([
      page.getAttribute(`ul.product-section--content > li:nth-of-type(${i + 1}) > article > a > figure.productitem--image > img`, 'src'),
      page.locator(`ul.product-section--content > li:nth-of-type(${i + 1}) > article > .productitem--info > .productitem--title > a`).textContent(),
      page.locator(`ul.product-section--content > li:nth-of-type(${i + 1}) > article > .productitem--info > .productitem--price > .price--main > span.money > span.money`).textContent(),
    ]);

    let image = itemData[0].status === 'fulfilled' ? 'https:' + itemData[0].value : '';
    let title = itemData[1].status === 'fulfilled' ? itemData[1].value ?? '' : '';
    let price = itemData[2].status === 'fulfilled' ? itemData[2].value ?? '' : '';

    const cleanData = {
      image,
      title: trim(title),
      price: trim(price)
    }

    recommendedProducts.push(cleanData)
  }

  const results = {
    title: trim(title),
    price: {
      currentPrice: trim(price),
      discountedPrice: ''
    },
    description: trim(description),
    images: [`https:${coverImg}`],
    recommended: recommendedProducts,
    currency: 'SGD'
  } satisfies ProductsResults

  return results
}

async function enqueueCategoriesDetailsPage({page, enqueueLinks}: Params) {
  const productPageSelector = `article.productitem > a.productitem--image-link`
  await page.waitForSelector(productPageSelector)

  await enqueueLinks({
    selector: productPageSelector,
    label: 'PRODUCT_DETAIL'
  })

  const categoriesListSelector = 'ul.productgrid--items > li > article > a.productitem--image-link'
  const hasNextPage = await page.$(categoriesListSelector);
  if (hasNextPage) {
    await enqueueLinks({
      selector: categoriesListSelector,
      label: 'CATEGORIES'
    })
  }
}

async function enqueueCategoriesPage({page, enqueueLinks}: Params) {
  const selector = 'ul.productgrid--items > li > article > a.productitem--image-link'

  await page.waitForSelector(selector)

  await enqueueLinks({
    selector,
    label: 'CATEGORIES'
  })
}

export const naiiUrl = 'https://naiise.com/collections/java-eco-project'

export const naiiCrawler = {
  // @ts-ignore
  browserPoolOptions: defaultBrowserPoolOptions,
  requestHandler: async ({page, request, enqueueLinks}) => {
    console.log(`Processing: ${request.url}`);
    if (request.label === 'PRODUCT_DETAIL') {
      const results = await enqueueProductDetailPage({page, enqueueLinks})
      console.log('🚀🚀 🚀  Got it! Storing product: ', results.title)
      const data = await Dataset.open('naii-products');
      await data.pushData(results);

      await data.exportToJSON('naii-products')
    } else if (request.label === 'CATEGORIES') {
      await enqueueCategoriesDetailsPage({page, enqueueLinks})
    } else {
      await enqueueCategoriesPage({page, enqueueLinks})
    }
  },
  maxRequestsPerCrawl: 80, // Limit the number of requests to prevent infinite crawling in large sites,
  // headless: false
} satisfies PlaywrightCrawler