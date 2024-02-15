import {PlaywrightCrawler} from "crawlee";
import {Params, ProductsResults} from "../types.js";
import {getTextContent, MarketPlaceLabel, scrollToAndWaitForSelector} from "../util/index.js";
import {defaultBrowserPoolOptions} from "../util/constant.js";

const CATEGORY_SELECTOR = `.product-each-div > .product-each > .image-con > a`

export async function enqueueProductDetailPage({page}: Pick<Params, 'page'>) {
  /**
   * ***********
   * Scroll to change the currency
   * ***********
   */

  try {
    await scrollToAndWaitForSelector(page, '.currency-selector-footer > form')

    const selectEl = await page.waitForSelector('select#currency-select')
    await selectEl.selectOption({value: 'SG'})

  } catch (error) {
    console.log(`Error switching language`, error)
  }

  /**
   * **************
   * General info needed
   * **************
   */
  const title = await getTextContent(page, '.product-info > h1#product-title')

  let currentPrice = '', discountedPrice = ''
  try {
    const isDiscountApplied = await page.locator('.product-info-price > span.product-price').innerHTML()
    if (isDiscountApplied.includes('strike')) {
      discountedPrice = await page.locator('.product-info-price > span.product-price > .c-black').textContent() ?? ''
      currentPrice = await page.locator('.product-info-price > span.product-price > .c-textpink').textContent() ?? ''
    } else {
      currentPrice = await page.locator('.product-info-price > span.product-price').textContent() ?? ''
    }

  } catch (error) {
    console.log(`Error when running price`, error)
  }

  /**
   * **************
   * Description & images
   * **************
   */
  let description = ''
  try {
    await page.click('.accordion-wrapper > div.accordion >> text="Description"')

    await page.waitForSelector('.accordion-wrapper')
    description = await page.locator('div.description[aria-hidden="false"]').innerText() ?? ''
  } catch (error) {
    console.log(`Error clicking description`, error)
  }

  let images: string[] = []
  try {
    await page.waitForSelector('.swiper-wrapper.product-images-thumbnails')

    images = await page.$$eval('.swiper-wrapper.product-images-thumbnails > .swiper-slide > .global-image-wrapper > img', imgs => {
      return imgs.map((img) => {
        const oriSrc = 'https:' + img.getAttribute('data-src');

        return oriSrc;
      })
    })
  } catch (error) {
    console.log(`Error Images`, error)
  }

  /**
   * **************
   * Recommended Products
   * **************
   */
  let recommended: unknown[] = []
  try {
    await scrollToAndWaitForSelector(page, '.shopthelook')

    recommended = await page.$$eval('div.swiper-slide[role="group"]', (productElements) =>
      productElements.map((productElement) => {
        const titleElement = productElement.querySelector('h3 a');
        const title = titleElement ? titleElement.textContent.trim() : '';

        const imageElement = productElement.querySelector('.image-con img');
        const imageURL = imageElement ? imageElement.getAttribute('src') : '';

        let currentPrice = '', discountedPrice = ''
        const isDiscountApplied = productElement.querySelector('.details-con > div')?.innerHTML ?? ''

        if (isDiscountApplied.includes('strike')) {
          currentPrice = productElement.querySelector('.details-con > div > span > span.c-textpink')?.textContent ?? ''
          discountedPrice = productElement.querySelector('.details-con > div > .c-black')?.textContent ?? ''
        } else {
          currentPrice = productElement.querySelector('.details-con > div > span')?.textContent ?? ''
        }

        return {title, image: `https:${imageURL}`, price: {currentPrice, discountedPrice}};
      }).filter(i => i.title !== '')
    );
  } catch (error) {
    console.log(`Error clicking description`, error)
  }

  const results = {
    title,
    description,
    images,
    price: {
      currentPrice,
      discountedPrice
    },
    recommended,
    currency: "SGD"
  } satisfies ProductsResults

  return results
}

async function enqueueCategoryDetailPage({page, enqueueLinks}: Params) {
  const results = await enqueueProductDetailPage({page})
  console.log('debugging: ', {results})

  const hasNextPage = await page.$(CATEGORY_SELECTOR);
  if (hasNextPage) {
    await enqueueLinks({
      selector: CATEGORY_SELECTOR, label: MarketPlaceLabel.CATEGORY
    })
  }
}

async function enqueueCategoryPage({page, enqueueLinks}: Params) {
  await page.waitForSelector(CATEGORY_SELECTOR)

  await enqueueLinks({
    label: MarketPlaceLabel.CATEGORY, selector: CATEGORY_SELECTOR
  })
}

export const dmkUrl = 'https://www.dmk.com.sg/collections/heel-pumps'

export const dmkCrawler = {
  // @ts-ignore
  browserPoolOptions: defaultBrowserPoolOptions, requestHandler: async ({page, request, enqueueLinks}) => {
    console.log(`Processing: ${request.url}`)
    if (request.label === MarketPlaceLabel.CATEGORY) {
      await enqueueCategoryDetailPage({page, enqueueLinks})
    } else {
      await enqueueCategoryPage({page, enqueueLinks})
    }
  }, maxRequestsPerCrawl: 8, // Limit the number of requests to prevent infinite crawling in large sites,
  // headless: false
} satisfies PlaywrightCrawler