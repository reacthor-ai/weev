import {Dataset, PlaywrightCrawler} from "crawlee";
import {Params, ProductsResults} from "../types.js";
import {getFulfilledValue, getTextContent, MarketPlaceLabel} from "../util/index.js";
import {defaultBrowserPoolOptions} from "../util/constant.js";

export async function enqueueProductDetailPage({page}: Pick<Params, 'page'>) {

  /**
   * **************
   * General info needed
   * **************
   */
  const generalInfo = [
    '.ProductMeta > h1.ProductMeta__Title',
    '.ProductMeta__PriceList > span.ProductMeta__Price.Price',
  ]
  const generalInfoResult = await Promise.allSettled(
    generalInfo.map((selector) => getTextContent(page, selector))
  );
  const [title, price] = generalInfoResult.map(result => getFulfilledValue(result));

  let description = '', images: string[] = []
  try {
    description = await page.$$eval('.Rte p.para-style-body span', (paragraphs) =>
      paragraphs.map(p => p.textContent.trim()).join('\n')
    );

  } catch (error) {
  }

  try {
    images = await page.$$eval('.Product__SlideItem img', (images) => {
      return images.map((img) => {
        const src = 'https:' + img.getAttribute('data-original-src');

        return src
      })
    })
  } catch (error) {
  }

  /**
   * **************
   * In case a product is discounted
   * **************
   */
  const otherPrices = [
    '.ProductMeta__Price.Price.Price--highlight',
    '.ProductMeta__Price.Price.Price--compareAt'
  ]
  const otherPricesResult = await Promise.allSettled(
    otherPrices.map((selector) => getTextContent(page, selector))
  )
  const [discountedPrice, generalPrice] = otherPricesResult.map((result) => getFulfilledValue(result))

  /**
   * **************
   * Collapsable Features
   * **************
   */
  let metaFeatures = null
  try {
    await page.click('button.Collapsible__Button >> text="Features"')

    await page.waitForSelector('.Collapsible__Inner > .Collapsible__Content > .Rte > .metafield-rich_text_field')
    metaFeatures = await page.$$eval('.Collapsible__Content .Rte .metafield-rich_text_field', (listItems) => {
      // Map over each list item and return its inner text
      return listItems.map(items => items.innerText.trim());
    });
  } catch (error) {
  }

  /**
   * **************
   * Size and Fit
   * **************
   */
  let metaSizeFit = null
  try {
    await page.click('button.Collapsible__Button >> text="Size & Fit"')
    await page.waitForSelector('.Collapsible__Inner > .Collapsible__Content > .Rte > .metafield-rich_text_field')
    metaSizeFit = await page.$$eval('.Collapsible__Content .Rte .metafield-rich_text_field', (listItems) => {
      // Map over each list item and return its inner text
      return listItems.map(items => items.innerText.trim());
    });
  } catch (error) {
  }

  /**
   * **************
   * Ratings & Comments
   * **************
   */
  let rating = ''
  let reviews: unknown[] = []
  try {
    await page.waitForSelector('span.stamped-summary-caption', {timeout: 5000})

    rating = await getTextContent(page, 'span.stamped-summary-text-1 > strong')
    reviews = await page.$$eval('.stamped-review', (reviews) => {
      return reviews.map((review) => {
        const name = review.querySelector('.author')?.innerText.trim();
        const star = review.querySelector('.stamped-starratings')?.getAttribute('data-rating');
        const title = review.querySelector('.stamped-review-header-title')?.innerText.trim();
        const description = review.querySelector('.stamped-review-content-body')?.innerText.trim();
        const date = review.querySelector('.created')?.innerText.trim();
        const location = review.querySelector('[data-location]')?.innerText.trim();

        return {name, star, title, description, date, location};
      });
    });
  } catch (error) {
    console.log(`ERRORRO: `, error)
  }

  /**
   * **************
   * Recommended Products
   * **************
   */
  let recommendedProducts: unknown[] = []
  try {
    await page.waitForSelector('.ProductRecommendations', {timeout: 5000})

    recommendedProducts = await page.$$eval('.ProductItem', (productItems) => {
      return productItems.map((item) => {
        // Extracting all image URLs
        const imageElements = item.querySelectorAll('.ProductItem__ImageWrapper img');
        const images = Array.from(imageElements).map(img => 'https:' + img.srcset || 'https:' + img.src);

        // Extracting the title
        const titleElement = item.querySelector('.ProductItem__Title a');
        const title = titleElement ? titleElement.innerText.trim() : '';

        // Extracting prices
        const priceElement = item.querySelector('.ProductItem__Price');
        const price = priceElement ? priceElement.innerText.trim() : '';

        // Handling discounted and compared prices
        let discountedPrice = '';
        let comparedAt = '';

        const priceListElements = item.querySelectorAll('.ProductItem__PriceList .ProductItem__Price');
        if (priceListElements.length > 1) {
          discountedPrice = priceListElements[0].innerText.trim();
          comparedAt = priceListElements[1].innerText.trim();
        } else if (priceListElements.length === 1) {
          comparedAt = priceListElements[0].innerText.trim();
        }

        return {images, title, price, discountedPrice, comparedAt};
      });
    });
  } catch (error) {
    console.log('ERROROR RECOMMENDED PRODUCTS', error)
  }

  const results = {
    title,
    price: {
      currentPrice: price,
      discountedPrice,
    },
    description,
    images,
    marketplace: {
      features: metaFeatures,
      size: metaSizeFit,
    },
    rating,
    reviews,
    recommended: recommendedProducts,
    currency: 'SGD'
  } satisfies ProductsResults

  return results
}

export async function enqueueCategoryDetailPage({page, enqueueLinks}: Params) {
  const results = await enqueueProductDetailPage({page})
  const data = await Dataset.open('finix-batches');
  await data.pushData(results);

  await data.exportToJSON('finix-batches-1')

  const categoriesListSelector = '.ProductItem__Wrapper > .product-item__image-wrapper > a'
  const hasNextPage = await page.$(categoriesListSelector);
  if (hasNextPage) {
    await enqueueLinks({
      selector: categoriesListSelector,
      label: MarketPlaceLabel.CATEGORY
    })
  }
}

export async function enqueueCategoryPage({page, enqueueLinks}: Params) {
  const selectorCategoryPage = '.ProductItem__Wrapper > .product-item__image-wrapper > a'
  await page.waitForSelector(selectorCategoryPage)

  await enqueueLinks({
    label: MarketPlaceLabel.CATEGORY,
    selector: selectorCategoryPage
  })
}

export const finixUrl = 'https://finixwear.com/collections/outerwear'

export const finixCrawler = {
  // @ts-ignore
  browserPoolOptions: defaultBrowserPoolOptions,
  requestHandler: async ({page, request, enqueueLinks}) => {
    console.log(`Processing: ${request.url}`)

    if (request.label === MarketPlaceLabel.CATEGORY) {
      await enqueueCategoryDetailPage({page, enqueueLinks})
    } else {
      await enqueueCategoryPage({page, enqueueLinks})
    }
  },
  maxRequestsPerCrawl: 60, // Limit the number of requests to prevent infinite crawling in large sites,
  // headless: false
} satisfies PlaywrightCrawler