import {Dataset, PlaywrightCrawler} from "crawlee";
import {Params, ProductsResults} from "../types.js";
import {getFulfilledValue, getTextContent, MarketPlaceLabel} from "../util/index.js";
import {defaultBrowserPoolOptions} from "../util/constant.js";

const CATEGORY_SELECTOR = 'div[data-selenium="category-product"] a'

async function enqueueProductDetailPage({page}: Params) {
  await page.waitForSelector('div[role="menuitem"]')

  /**
   * **************
   * General info needed
   * **************
   */
  const generalInfo = [
    'div[class*="__nameBlock-name"] h1',
    'span[data-selenium="product-price"]',
    'span[class*="__reg"]'
  ]
  const generalInfoResult = await Promise.allSettled(
    generalInfo.map((selector) => getTextContent(page, selector))
  );
  const [title, baseSale, beforePrice] = generalInfoResult.map(result => getFulfilledValue(result));
  let description = ''
  try {
    description = await page.$$eval('div[class*="__head"] h2', (paragraphs) =>
      paragraphs.map(p => p.textContent.trim()).join('\n')
    );

  } catch (error) {
  }

  /**
   * ***********
   * Material and dimensions and care
   * ***********
   */
  let materials = null
  try {
    await page.click('div[class*="__header"][role="button"] >> text="Product Material & Care"')

    await page.waitForSelector('div[class*="__property"]')
    materials = await page.$$eval('div[class*="__property"]', (listItems) => {
      return listItems.map(items => {
        const type = items?.querySelector('span[class*="__property__title"]')?.textContent?.replace(':', '') || '';
        const content = items?.querySelector('span[class*="__property__value"]')?.textContent || '';

        return {type, content}
      });
    });
  } catch (error) {
    console.log('Materials error', error)
  }

  // __header-rating-count

  /**
   * ***********
   * Ratings
   * ***********
   */
  let reviewCount = null
  let reviewContent

  try {
    await page.waitForSelector('span[class*="__header-rating-count"]')
    reviewCount = await getTextContent(page, 'span[class*="__header-rating-count"]')
    reviewCount = reviewCount.replace('Reviews', '').trim()

    reviewContent = await page.$$eval('.reviewContent > div', (listItems) => {
      return listItems.map(items => {
        const title = items?.querySelector('[class*="__content-title"]')?.textContent || '';
        const content = items?.querySelector('[class*="__content-body"]')?.innerText.trim() || '';
        const productName = items?.querySelector('[class*="__content-variant-name"] a')?.textContent || '';
        const date = items?.querySelector('[class*="__date"]')?.innerText.trim() || '';

        return {title, content, productName, date}
      });
    });
  } catch (error) {
    console.log('Ratings error', error)
  }

  let recommendedProducts: unknown[] = []
  try {
    await page.waitForSelector(':scope [class*="__list"] > h2')

    recommendedProducts = await page.$$eval('div[data-selenium="category-product"]', (listItems) => {
      return listItems.map(items => {
        const title = items?.querySelector('[class*="__name"]')?.textContent || '';
        const description = items?.querySelector('[class*="__shortDesc"]')?.textContent || '';

        let currentPrice = '', discountedPrice = ''
        const isDiscountedPrice = items.querySelector('[class*="__price"]')?.innerHTML ?? ''

        if (isDiscountedPrice.includes('span')) {
          currentPrice = items?.querySelector('[aria-label*="Sale Price:"]')?.textContent || '';
          discountedPrice = items?.querySelector('[aria-label*="Regular Price:"]')?.textContent || '';
        } else {
          currentPrice = items.querySelector('[class*="__price"]')?.textContent ?? ''
        }

        return {title, description, price: {currentPrice, discountedPrice}}
      });
    });
  } catch (error) {
    console.log('Recommended products error', error)
  }


  const results = {
    title,
    price: {
      currentPrice: baseSale,
      discountedPrice: beforePrice
    },
    marketplace: {
      materials,
      reviewCount,
    },
    reviews: reviewContent,
    recommended: recommendedProducts,
    description,
    images: [''],
    currency: 'SGD'
  } satisfies ProductsResults

  return results
}

async function enqueueCategoryDetailPage({page, enqueueLinks}: Params) {
  const productPageSelector = `div[data-selenium="category-product"] > div[class*="__bottom"] > a[class*="__name"]`
  await page.waitForSelector(productPageSelector)

  await enqueueLinks({
    selector: productPageSelector,
    label: MarketPlaceLabel.PRODUCT_DETAIL
  })

  const hasNextPage = await page.$(CATEGORY_SELECTOR);
  if (hasNextPage) {
    await enqueueLinks({
      selector: CATEGORY_SELECTOR,
      label: MarketPlaceLabel.CATEGORY
    })
  }
}

async function enqueueCategoryPage({page, enqueueLinks}: Params) {
  await page.waitForSelector(CATEGORY_SELECTOR)

  await enqueueLinks({
    label: MarketPlaceLabel.CATEGORY,
    selector: CATEGORY_SELECTOR
  })
}

export const castellUrl = 'https://www.castlery.com/sg/chairs-benches/armchairs'

export const castellCrawler = {
  // @ts-ignore
  browserPoolOptions: defaultBrowserPoolOptions,
  requestHandler: async ({page, request, enqueueLinks}) => {
    console.log(`Processing: ${request.url}`)

    if (request.label === MarketPlaceLabel.PRODUCT_DETAIL) {
      const results = await enqueueProductDetailPage({page, enqueueLinks})
      console.log('🚀🚀 🚀  Got it! Storing product: ', results.title)
      const data = await Dataset.open('cast-products');
      await data.pushData(results);

      await data.exportToJSON('cast-products')
    } else if (request.label === MarketPlaceLabel.CATEGORY) {
      await enqueueCategoryDetailPage({page, enqueueLinks})
    } else {
      await enqueueCategoryPage({page, enqueueLinks})
    }
  },
  maxRequestsPerCrawl: 80, // Limit the number of requests to prevent infinite crawling in large sites,
  // headless: false
} satisfies PlaywrightCrawler