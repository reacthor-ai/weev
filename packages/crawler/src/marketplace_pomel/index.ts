import {PlaywrightCrawler} from "crawlee";
import {getFulfilledValue, getTextContent, MarketPlaceLabel, scrollToAndWaitForSelector} from "../util/index.js";
import {Params, ProductsResults} from "../types.js";
import {defaultBrowserPoolOptions} from "../util/constant.js";

async function enqueueProductDetailPage({page}: Pick<Params, 'page'>) {
  await page.waitForSelector('h1.pdp__name-container > span.pdp__name-self')

  /**
   * *************
   * General Info
   * *************
   */
  const generalInfo = [
    'h1.pdp__name-container > span.pdp__name-self',
    '#pdp_price_name > .pdp__price-container > span.pdp__original-price',
    '.pdp__price-container > .pdp__discounted-price',
    '.pdp__price-container > .pdp__original-price-line-through'
  ]
  const generalInfoResult = await Promise.allSettled(
    generalInfo.map((selector) => getTextContent(page, selector))
  );
  let images: string[] = []
  const [title, price, discountedPrice, originalPrice] = generalInfoResult.map(result => getFulfilledValue(result));
  try {
    images = await page.$$eval('.pdp__hero-img .picture img.image', (images) => {
      return images.map((img) => {
        const src = img.src

        return src
      })
    })
  } catch (error) {
  }

  /**
   * *************
   * Size &* Guide
   * *************
   */
  let size = null
  try {
    await page.waitForSelector('.pdp__interactions-size', {timeout: 50000})
    await page.click('button.accordion__header >> text="Size Guide"')
    size = await page.$$eval('.pml-info-box-content', (listItems) => {
      return listItems.map(items => items.innerText.trim());
    })
  } catch (error) {
    console.log('Size &* Guide', error)
  }

  /**
   * *************
   * Details
   * *************
   */
  let description = ''
  try {
    await page.waitForSelector('.pdp__descriptions-container')
    await page.click('button.accordion__header >> text="Details"')
    description = await page.$$eval('.pdp__product-details', (listItems) => {
      return listItems.map(items => items.innerText.trim());
    })
  } catch (error) {
    console.log('Details', error)
  }

  /**
   * *************
   * Materials
   * *************
   */
  let materials = null
  try {
    await page.waitForSelector('button.accordion__header >> text="Materials"')
    await page.click('button.accordion__header >> text="Materials"')
    materials = await page.$$eval('.pdp__product-materials .pdp__product-materials__lists', (listItems) => {
      return listItems.map(items => items.innerText.trim());
    })
  } catch (error) {
    console.log('Materials', error)
  }

  /**
   * *************
   * Care instructions
   * *************
   */
  let careInstructions = null
  try {
    await page.waitForSelector('button.accordion__header >> text="Care Instructions"', {timeout: 50000})
    await page.click('button.accordion__header >> text="Care Instructions"')
    careInstructions = await page.$$eval('.pdp__care-instructions .feature', (instructions) => {
      return instructions.map((instruction) => {
        const title = instruction.querySelector('.feature__title')?.textContent?.trim() ?? ''
        const info = instruction.querySelector('.feature__information')?.textContent?.trim() ?? ''

        return {title, info}
      })
    })
  } catch (error) {
  }


  /**
   * *************
   * People also bought
   * *************
   */
  let popularProducts: unknown[] = []
  try {
    await scrollToAndWaitForSelector(page, '#just-for-you');
    popularProducts = await page.$$eval('.product-item', (productItems) => {
      return productItems.map((item) => {
        // Extracting the main image URL
        const mainImageElement = item.querySelector('.product-image__cover img');
        const mainImageUrl = mainImageElement ? mainImageElement.src : '';

        // Extracting the hover image URL
        const hoverImageElement = item.querySelector('.product-image__hover img');
        const hoverImageUrl = hoverImageElement ? hoverImageElement.src : '';

        // Extracting the product name
        const productNameElement = item.querySelector('.product-item-name__clickable .product_description__wrapper');
        const productName = productNameElement ? productNameElement.innerText.trim() : '';

        // Extracting the prices
        const discountedPriceElement = item.querySelector('.discounted__price');
        const fullPriceElement = item.querySelector('.full__price');

        let discountedPrice, originalPrice;

        if (discountedPriceElement && fullPriceElement) {
          // If there is a discounted price and a full price, we extract both
          discountedPrice = discountedPriceElement.innerText.trim();
          originalPrice = fullPriceElement.innerText.trim();
        } else {
          // If there is only one price, we consider it as the main price
          const priceElement = item.querySelector('.product_price__wrapper');
          discountedPrice = priceElement ? priceElement.innerText.trim() : '';
          originalPrice = null; // No original price available
        }

        return {mainImageUrl, hoverImageUrl, productName, discountedPrice, originalPrice};
      });
    });

  } catch (error) {
    console.log(`Popular Products: Errors`, error)
  }

  const results = {
    title,
    price: {
      discountedPrice,
      currentPrice: originalPrice,
    },
    marketplace: {
      size,
      materials,
      careInstructions,
    },
    description,
    images,
    recommended: popularProducts,
    currency: 'SGD'
  } satisfies ProductsResults

  return results
}

async function enqueueCategoryDetailsPage({page, enqueueLinks}: Params) {
  const results = await enqueueProductDetailPage({page})
  console.log({results})

  const categoriesListSelector = '.product-item > .product-item > a'
  const hasNextPage = await page.$(categoriesListSelector);
  if (hasNextPage) {
    await enqueueLinks({
      selector: categoriesListSelector,
      label: MarketPlaceLabel.CATEGORY
    })
  }
}

async function enqueueCategoryPage({page, enqueueLinks}: Params) {
  const selectorCategoryPage = '.product-item > .product-item > a'
  await page.waitForSelector(selectorCategoryPage)

  await enqueueLinks({
    label: MarketPlaceLabel.CATEGORY,
    selector: selectorCategoryPage
  })
}

export const pomelUrl = 'https://www.pomelofashion.com/sg/en/bottoms/101548-high-waist-jeans-baby-blue.html'

export const pomelCrawler = {
  // @ts-ignore
  browserPoolOptions: defaultBrowserPoolOptions,
  requestHandler: async ({page, request, enqueueLinks}) => {
    console.log(`Processing: ${request.url}`);
    const results = await enqueueProductDetailPage({page})
    console.log({results})
    // if (request.label === MarketPlaceLabel.CATEGORY) {
    //   await enqueueCategoryDetailsPage({page, enqueueLinks})
    // } else {
    //   await enqueueCategoryPage({page, enqueueLinks})
    // }
  },
  maxRequestsPerCrawl: 3, // Limit the number of requests to prevent infinite crawling in large sites,
  // headless: false
} satisfies PlaywrightCrawler