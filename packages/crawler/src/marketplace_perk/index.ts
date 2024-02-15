import {defaultBrowserPoolOptions} from "../util/constant.js";
import {Dataset, PlaywrightCrawler} from "crawlee";
import {Params, ProductsResults} from "../types.js";
import {getFulfilledValue, getTextContent, MarketPlaceLabel, scrollToAndWaitForSelector} from "../util/index.js";

const CATEGORY_TAG = `a.product__media__holder`

async function enqueueProductDetailPage({page}: Pick<Params, 'page'>) {
  try {
    await page.click('div.vnice-select').then(async () => {
      await page.click('li[data-value="SGD"]')
    });
  } catch (error) {
    console.log(`Error , loading product details`, error)
  }

  await page.waitForSelector('section.section-padding.product-single')
  /**
   * *************
   * General Info
   * *************
   */
  const generalInfo = ['h1.product__title', '.product__rating > span.product__rating__value', '.product__description > p']
  const generalInfoResult = await Promise.allSettled(generalInfo.map((selector) => getTextContent(page, selector)));
  const [title, rating, description] = generalInfoResult.map(result => getFulfilledValue(result));

  let originalPrice = '', discountedPrice = ''

  try {
    // $0 SGD
    const originalPriceApplied = await page.locator('s[data-compare-price].product__price--compare > span[data-vitals-cc-sgd]').textContent() ?? ''

    if (originalPriceApplied !== '$0 SGD') {
      originalPrice = await page.locator('span.product__price--regular.product__price--sale > span').textContent() ?? ''
      discountedPrice = await page.locator('s[data-compare-price].product__price--compare span.money').textContent() ?? ''
    } else {
      originalPrice = await page.locator('span.product__price--regular > span.money').textContent() ?? ''
    }

  } catch (error) {
    console.log(`Error [price]`, error)
  }

  let images: string[] = []
  try {
    await page.locator('.product-single__media.product-single__media--image > img')

    images = await page.$$eval('.product-single__media.product-single__media--image > noscript', image => {
      return image.map(img => {
        const match = img.textContent?.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/);

        return match ? `https:${match[1]}` : '';
      })
    })

  } catch (error) {
    console.log(`Error when getting images`, error)
  }

  /**
   * *************
   * Style
   * *************
   */
  let style = ''
  try {
    await page.click('button.product__accordion__title >> text="Style"', {timeout: 50000})
    await page.waitForSelector('.product__accordion')

    style = await page.locator('div[id*="ProductAccordion--page-style-1"]').innerText() ?? ''

  } catch (error) {
    console.log(`Error [style]`, error)
  }

  /**
   * *************
   * Care
   * *************
   */
  let care = ''
  try {
    await page.click('button.product__accordion__title >> text="Care"', {timeout: 20000})
    await page.waitForSelector('.product__accordion')

    care = await page.locator('div[id*="ProductAccordion--page-care-2"]').innerText() ?? ''

  } catch (error) {
    console.log(`Error [style]`, error)
  }

  /**
   * *************
   * Reviews
   * *************
   */
  let reviews: unknown[] = []
  try {
    await scrollToAndWaitForSelector(page, '.spr-content')
      .catch(() => {
        reviews = []
      });
    reviews = await page.$$eval('.spr-review', (reviewElements) => {
      return reviewElements.map((reviewElement) => {
        const title = reviewElement.querySelector('.spr-review-header-title')?.textContent || '';
        const name = reviewElement.querySelector('.spr-review-header-byline strong')?.textContent || '';
        const description = reviewElement.querySelector('.spr-review-content-body')?.textContent || '';
        const starRating = reviewElement.querySelector('.spr-starratings')?.getAttribute('aria-label') || '';

        // Extract the number of stars from the aria-label attribute
        const numberOfStars = starRating.match(/\d+/) ? parseInt(starRating.match(/\d+/)[0]) : 0;

        return {title, name, description, numberOfStars}
      });
    })

  } catch (error) {
    console.log(`Error [style]`, error)
  }

  /**
   * *************
   * Recommended
   * *************
   */
  let recommended: unknown[] = []
  try {
    await page.waitForSelector('.related-products')
    await scrollToAndWaitForSelector(page, '.related-products');
    recommended = await page.$$eval('.product-grid-item', (productElements) => {
      return productElements.map((productElement) => {
        const title = productElement.querySelector('.product-grid-item__title')?.textContent || '';
        const imageElement = productElement.querySelector('.product__media__image .background-size-cover');
        const dataBgSet = imageElement?.getAttribute('data-bgset') || '';
        const urls = dataBgSet.split(',').map((url) => url.trim().split(' ')[0]);
        const price = productElement.querySelector('.product-grid-item__price .money')?.textContent || '';

        return {title, image: (urls[0] && `https:${urls[0]}`), price};
      });
    });

  } catch (error) {
    console.log(`Error [style]`, error)
  }

  const results = {
    title, recommended, description, rating,
    reviews,
    currency: 'SGD',
    images,
    marketplace: {
      style,
      care,
    },
    price: {
      currentPrice: originalPrice,
      discountedPrice
    },
  } satisfies ProductsResults

  return results
}

async function enqueueSearchResultProductPage({page, enqueueLinks}: Params) {
  const results = await enqueueProductDetailPage({page})
  console.log('🚀🚀 🚀  Got it! Storing product: ', results.title)
  const data = await Dataset.open('perk-products');
  await data.pushData(results);

  await data.exportToJSON('perk-products')

  const hasNextPage = await page.$(CATEGORY_TAG);
  if (hasNextPage) {
    await enqueueLinks({
      selector: CATEGORY_TAG, label: MarketPlaceLabel.CATEGORY,
    })
  }
}

async function enqueueCategoryLinks({page, enqueueLinks}: Params) {
  await page.waitForSelector(CATEGORY_TAG)

  await enqueueLinks({
    selector: CATEGORY_TAG, label: MarketPlaceLabel.CATEGORY
  })
}

export const perkUrl = `https://www.perkbykate.com/collections/our-signatures`

export const perkCrawler = {
  // @ts-ignore
  browserPoolOptions: defaultBrowserPoolOptions, requestHandler: async ({page, request, enqueueLinks}) => {
    console.log(`Processing: ${request.url}`);

    if (request.label === MarketPlaceLabel.CATEGORY) {
      await enqueueSearchResultProductPage({page, enqueueLinks})
    } else {
      await enqueueCategoryLinks({page, enqueueLinks})
    }
  }, maxRequestsPerCrawl: 40, // Limit the number of requests to prevent infinite crawling in large sites,
  // headless: false
} satisfies PlaywrightCrawler