import {Dataset, PlaywrightCrawler} from "crawlee";
import {Params, ProductsResults} from "../types.js";
import {getTextContent, MarketPlaceLabel, trim} from "../util/index.js";
import {defaultBrowserPoolOptions} from "../util/constant.js";

// Main function
async function enqueueProductDetailPage({page}: Pick<Params, 'page'>) {
  await page.waitForSelector('.product__main');

  // General Info
  let title = ''
  try {
    title = await getTextContent(page, 'h1.sf-heading__title')
  } catch (error) {
    console.log(`Error getting title`, error)
  }

  let images = []
  try {
    images = await page.$$eval('ul.product-gallery__images > li.product-gallery__image img', imgs =>
      imgs.map(img => img.src ?? '')
    );
  } catch (error) {
    console.log(`Error images, `, images)
  }

  let currentPrice = '', discountedPrice = ''
  try {
    let isDiscountedPrice = await page.locator('.sf-price').innerHTML()
    if (isDiscountedPrice.includes('span')) {
      currentPrice = await page.locator('.sf-price > span.sf-price__value').innerText() ?? ''
    } else {
      currentPrice = await page.locator('.sf-price__value-special-container > .sf-price__value').innerText() ?? ''
      discountedPrice = await page.locator('.sf-price__value.sf-price__value--old').textContent() ?? ''
    }

  } catch (error) {
    console.log(`Error when getting prices`, error)
  }

  let description: string[] = []
  try {
    description = await page.$$eval('#details > .product__tab-details > .product__description', item => {
      return item.map(items => items.innerText.trim());
    })

  } catch (error) {
    console.log(`Error [description]`, error)
  }

  let sizeAndFit: unknown[] = []
  try {
    await page.evaluate(() => {
      const overlay = document.getElementById('wps_popup');
      if (overlay) {
        overlay.style.pointerEvents = 'none';
      }
    });
    await page.click('#m-product-additional-info > button.sf-button.sf-button--pure.sf-tabs__title >> text="Size & Fit"');

    sizeAndFit = await page.$$eval('.product__size-content', item => {
      return item.map(items => items.innerText.trim());
    })

  } catch (error) {
    console.log(`Error [size and fit], `, error)
  }

  let materials: unknown[] = []
  try {
    await page.evaluate(() => {
      const overlay = document.getElementById('wps_popup');
      if (overlay) {
        overlay.style.pointerEvents = 'none';
      }
    });

    await page.click('#m-product-additional-info > button.sf-button.sf-button--pure.sf-tabs__title >> text="Material & Care"');

    materials = await page.$$eval('.product__material-care-header', item => {
      return item.map(items => items.innerText.trim());
    })

  } catch (error) {
    console.log(`Error [materials], `, error)
  }

  // Ratings
  let reviews: unknown[] = []
  let rating = ''
  try {
    await page.waitForSelector('#o-product-review', {timeout: 5000})

    rating = await getTextContent(page, '.review-summary > .m-star-rating-minimal > span.average-rating');

    reviews = await page.$$eval('.review-item', (reviews) => {
      return reviews.map((review) => {
        const title = review.querySelector('.review-heading')?.textContent.trim();
        const fit = review.querySelector('.fit-rating')?.textContent.trim().replace('FIT : ', '');
        const variant = review.querySelector('.variant')?.textContent.trim();
        const description = review.querySelector('.review-body')?.textContent.trim();
        const locationDate = review.querySelector('.review-date i')?.textContent.trim().split('|').map(part => part.trim());
        const location = locationDate?.length > 2 ? locationDate[2] : ''; // Assuming the third part is the location
        const date = locationDate?.length > 1 ? locationDate[1] : ''; // Assuming the second part is the date

        return {title, fit, variant, description, location, date};
      });
    });
  } catch (error) {
    console.log(`Error when getting reviews`, error)
  }

  let recommendedProducts: unknown[] = []

  try {
    await page.waitForSelector('#similarProducts', {timeout: 6000})

    recommendedProducts = await page.$$eval('ul > li', (products) => {

      return products.map((product) => {
        const title = product.querySelector('.sf-product-card__title')?.textContent.trim();
        const subcategory = product.querySelector('.sf-product-card__subcategory')?.textContent.trim();

        let currentPrice = '', discountedPrice = ''
        const isDiscountedPrice = product.querySelector('.sf-product-card__price')?.innerHTML ?? ''

        if (isDiscountedPrice.includes('del') || isDiscountedPrice.includes('ins')) {
          currentPrice = product.querySelector('.sf-price__value.sf-price__value--special')?.textContent?.trim() ?? ''
          discountedPrice = product.querySelector('.sf-price__value.sf-price__value--old')?.textContent?.trim() ?? ''
        } else {
          currentPrice = product.querySelector('.sf-product-card__price')?.textContent?.trim() ?? ''
        }
        return {title, subcategory, price: {currentPrice, discountedPrice}};
      }).filter(ti => typeof ti.title !== 'undefined');
    });
  } catch (error) {
    console.log(`Error when getting recommended products`, error)
  }

  const results = {
    currency: 'SGD',
    title: trim(title),
    price: {
      currentPrice,
      discountedPrice
    },
    images,
    description,
    rating,
    recommended: recommendedProducts,
    reviews,
    marketplace: {
      sizeAndFit,
      materials
    },
  } satisfies ProductsResults

  return results
}

const CATEGORY_SELECTOR = '.sf-product-card > .sf-product-card__image-wrapper > a.sf-product-card__link'

export async function enqueueCategoryDetailsPage({page, enqueueLinks}: Params) {
  const results = await enqueueProductDetailPage({page})

  console.log('🚀🚀 🚀  Got it! Storing product: ', results.title)
  const data = await Dataset.open('bonit-batch');
  await data.pushData(results);

  await data.exportToJSON('bonit-batch-1')

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

async function closeBanner({page}: Pick<Params, 'page'>) {
  try {
    // Wait for the close button of the banner to be visible. This ensures that the element is not only present in the DOM but also visible to the user.
    await page.waitForSelector('.wps-overlay-close-button', {state: 'visible', timeout: 10000}); // Adjust the timeout as needed

    // Click the close button to close the banner. The then() block will execute after the click action completes.
    await page.click('.wps-overlay-close-button');

    console.log('Banner closed, proceeding with data extraction.');
  } catch (error) {
    console.log('Banner close button not found or not clickable, proceeding without closing it.');
  }
}

export const bonitoUrl = 'https://www.lovebonito.com/sg/shop/apparel-accessories/footwear?sort=stock_in_date%3Adesc&stock.is_in_stock=true'

export const bonitoCrawler = {
  // @ts-ignore
  browserPoolOptions: defaultBrowserPoolOptions,
  requestHandler: async ({page, request, enqueueLinks}) => {
    console.log(`Processing: ${request.url}`);

    if (request.label === MarketPlaceLabel.CATEGORY) {
      await enqueueCategoryDetailsPage({
        page,
        enqueueLinks
      })
    } else {
      await enqueueCategoryPage({
        page,
        enqueueLinks
      })
    }
  },
  maxRequestsPerCrawl: 70, // Limit the number of requests to prevent infinite crawling in large sites,
  // headless: false
} satisfies PlaywrightCrawler