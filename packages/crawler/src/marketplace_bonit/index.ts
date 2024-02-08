import {BrowserName, Dataset, DeviceCategory, OperatingSystemsName, PlaywrightCrawler} from "crawlee";
import {Params} from "../types.js";
import {
  getAttributeValue,
  getFulfilledValue,
  getTextContent,
  MarketPlaceLabel,
  scrollToAndWaitForSelector,
  trim
} from "../util/index.js";

// Main function
export async function enqueueProductDetailPage({page}: Pick<Params, 'page'>) {
  await page.waitForSelector('.product__header > header > h1.sf-heading__title');

  // General Info
  const [currency, price, availability, title, description] = await Promise.all([
    getAttributeValue(page, 'meta[itemprop="priceCurrency"]', 'content'),
    getAttributeValue(page, 'meta[itemprop="price"]', 'content'),
    getAttributeValue(page, 'meta[itemprop="availability"]', 'content'),
    getTextContent(page, '.product__header > header > h1.sf-heading__title'),
    getTextContent(page, 'div[itemprop="description"]'),
  ]);

  // Gallery Images
  const images = await page.$$eval('ul.product-gallery__images > li.product-gallery__image img', imgs => imgs.map(img => img.src ?? ''));

  // Additional properties
  const propertySelectors = [
    '.product__property:nth-of-type(2).a-product-attribute-base > .sf-property > span.sf-property__value',
    '.product__property:nth-of-type(3).a-product-attribute-base > .sf-property > span.sf-property__value',
    '.product__property:nth-of-type(4).a-product-attribute-base > .sf-property > span.sf-property__value',
    '.product__size-content > .product__size-header'
  ];
  const propertiesResults = await Promise.allSettled(propertySelectors.map(selector => getTextContent(page, selector)));
  const [lining, sheerness, pockets, additionalProperty] = propertiesResults.map(result => getFulfilledValue(result));

  // Size & Fit
  await page.click('button.sf-button--pure.sf-tabs__title >> text="Size & Fit"');
  await scrollToAndWaitForSelector(page, '.sf-tabs__content .a-product-size-fit');

  const modelDetailsSelectors = [
    '.model-title b',
    '.model-config > .config-row:nth-of-type(1) > .config-item:nth-of-type(1) > .config-value',
    '.model-config > .config-row:nth-of-type(1) > .config-item:nth-of-type(2) > .config-value',
    '.model-config > .config-row:nth-of-type(2) > .config-item:nth-of-type(1) > .config-value',
    '.model-config > .config-row:nth-of-type(2) > .config-item:nth-of-type(2) > .config-value'
  ];
  const modelDetailsResults = await Promise.allSettled(modelDetailsSelectors.map(selector => getTextContent(page, selector)));
  const [size, height, bust, waist, hip] = modelDetailsResults.map(result => getFulfilledValue(result));

  // Ratings
  await scrollToAndWaitForSelector(page, '#o-product-review');
  const rating = await getTextContent(page, '.review-summary > .m-star-rating-minimal > span.average-rating');

  // Reviews
  const reviews = await page.$$eval('.review-item', (reviews) => {
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

  // Recommended Products
  await scrollToAndWaitForSelector(page, '#similarProductsWrapper');
  const recommendedProducts = await page.$$eval('.sf-product-card', (products) => {
    return products.map((product) => {
      const title = product.querySelector('.sf-product-card__title')?.textContent.trim();
      const subcategory = product.querySelector('.sf-product-card__subcategory')?.textContent.trim();
      const price = product.querySelector('.sf-price__value--special')?.textContent.trim() || product.querySelector('.sf-price__value')?.textContent.trim();
      const imageUrl = product.querySelector('.sf-product-card__image-wrapper img')?.src;
      const productUrl = product.querySelector('.sf-product-card__link')?.href;

      return {title, subcategory, price, imageUrl, productUrl};
    });
  });

  const results = {
    url: page.url(),
    currency,
    title: trim(title),
    price,
    availability,
    from: "Singapore",
    images,
    description,
    properties: {
      lining,
      sheerness,
      pockets,
      additionalProperty
    },
    model: {
      size,
      height: trim(height),
      bust: trim(bust),
      waist: trim(waist),
      hip: trim(hip),
    },
    rating,
    recommendedProducts,
    reviews,
  }

  return results
}

export async function enqueueCategoryDetailsPage({page, enqueueLinks}: Params) {
  const results = await enqueueProductDetailPage({page})

  console.log('🚀🚀 🚀  Got it! Storing product: ', results.title)
  const data = await Dataset.open('bonit-batch');
  await data.pushData(results);

  await data.exportToJSON('bonit-batch-1')

  const categoriesListSelector = '.sf-product-card > .sf-product-card__image-wrapper > a.sf-product-card__link'
  const hasNextPage = await page.$(categoriesListSelector);
  if (hasNextPage) {
    await enqueueLinks({
      selector: categoriesListSelector,
      label: MarketPlaceLabel.CATEGORY
    })
  }
}

export async function enqueueCategoryPage({page, enqueueLinks}: Params) {
  await page.waitForSelector('.wps-overlay-close-button')

  await page.click('.wps-overlay-close-button')

  const selectorCategoryPage = '.sf-product-card > .sf-product-card__image-wrapper > a.sf-product-card__link'
  await page.waitForSelector(selectorCategoryPage)

  await enqueueLinks({
    label: MarketPlaceLabel.CATEGORY,
    selector: selectorCategoryPage
  })
}

export const bonitoUrl = 'https://www.lovebonito.com/sg/defined-backless-stick-on-bra.html'

export const bonitoCrawler = {
  browserPoolOptions: {
    preLaunchHooks: [() => {
      // do something before a browser gets launched
      //
      console.log('running pre launch')
    }],
    fingerprintOptions: {
      fingerprintGeneratorOptions: {
        browsers: [{
          name: BrowserName.firefox,
          minVersion: 96,
        }],
        devices: [
          DeviceCategory.desktop,
        ],
        operatingSystems: [
          OperatingSystemsName.macos,
        ],
      },
    },
  },
  requestHandler: async ({page, request, enqueueLinks}) => {
    console.log(`Processing: ${request.url}`);
    try {
      // Wait for the close button of the banner to be visible. This ensures that the element is not only present in the DOM but also visible to the user.
      await page.waitForSelector('.wps-overlay-close-button', {state: 'visible', timeout: 10000}); // Adjust the timeout as needed

      // Click the close button to close the banner. The then() block will execute after the click action completes.
      await page.click('.wps-overlay-close-button');

      console.log('Banner closed, proceeding with data extraction.');
    } catch (error) {
      console.log('Banner close button not found or not clickable, proceeding without closing it.');
    }

// Proceed with your data extraction and storage
    const results = await enqueueProductDetailPage({page});
    console.log('🚀🚀 🚀  Got it! Storing product: ', results.title);

    const data = await Dataset.open('bonit-batch');
    await data.pushData(results);

    await data.exportToJSON('bonit-batch-1');
  },
  maxRequestsPerCrawl: 3, // Limit the number of requests to prevent infinite crawling in large sites,
  headless: false
} satisfies PlaywrightCrawler