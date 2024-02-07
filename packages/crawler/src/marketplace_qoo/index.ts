import {EnqueueLinksOptions} from "@crawlee/core";
import {BatchAddRequestsResult} from "@crawlee/types";
import {Page} from "playwright";
import {BrowserName, Dataset, DeviceCategory, OperatingSystemsName, PlaywrightCrawler} from "crawlee";
import {Params} from "../types.js";

/**
 * ONLY RUN THIS: IF you only want images, product detail, and price.
 */

// Function to enqueue links from category pages
async function enqueueCategoryLinks({page, enqueueLinks}: Params) {
  /**
   * Move to a different page.
   */
  let imgs: string[] = [];
  let imageCount = 0;
  const maxImages = 3;

  await page.route('**/*.{png,jpg,jpeg}', (route) => {
    if (imageCount < maxImages) {
      const requestUrl = route.request().url();
      imgs.push(requestUrl);
      imageCount++;
    }
    route.continue(); // Continue the route whether the image URL is stored or not
  });

  /**
   * General Information
   */
  const productTitle = await page.locator('.goods-product__title > h2.name',).textContent()
  const dataPrice = await page.locator('#txt_qprice').getAttribute('data-price') ?? ''
  const productFrom = await page.locator('h3.col-title:has-text("Delivers From") + div.col').textContent() ?? '';

  const [soldResult, percentResult, reviewersResult, customerSatisfiedResult] = await Promise.allSettled([
    page.locator('div.list:has(h3.list__title:has-text("Sold")) p.list__desc strong').textContent(),
    page.locator('div.list:has(h3.list__title:has-text("Recommended")) p.list__desc strong').textContent(),
    page.locator('div.list:has(h3.list__title:has-text("Recommended")) p.list__desc em').textContent(),
    page.locator('div.list:has(h3.list__title:has-text("Customers Satisfied")) p.list__desc strong').textContent(),
  ]);

  let sold = soldResult.status === 'fulfilled' ? soldResult.value : '';
  let percent = percentResult.status === 'fulfilled' ? percentResult.value : '';
  let reviewers = reviewersResult.status === 'fulfilled' ? reviewersResult.value : ''; // Extracting numbers
  let customer_satisfied = customerSatisfiedResult.status === 'fulfilled' ? customerSatisfiedResult.value : '';

  const itemsData = [];

  // await page.locator('li#tab_review > a').scrollIntoViewIfNeeded({timeout: 5000});
  await page.evaluate(() => {
    const reviewTab = document.querySelector('#tab_review > a');
    if (reviewTab) (reviewTab as any).click();
  });

  await page.waitForSelector('ul#ul_list > li');

  const itemCount = await page.locator('ul#ul_list > li').count();

  // Loop through each item and extract the data
  for (let i = 0; i < itemCount; i++) {
    const itemData = await Promise.allSettled([
      page.locator(`ul#ul_list > li:nth-of-type(${i + 1}) .rv_area .tit a`).textContent(),
      page.locator(`ul#ul_list > li:nth-of-type(${i + 1}) .rv_area .rv`).textContent(),
      page.locator(`ul#ul_list > li:nth-of-type(${i + 1}) .rv_area .info .date`).textContent(),
      page.locator(`ul#ul_list > li:nth-of-type(${i + 1}) .rv_area .tit .rate-star .on`).evaluate(node => node.style.width),
      page.locator(`ul#ul_list > li:nth-of-type(${i + 1}) .rv_area .info .by`).textContent(),
    ]);

    // Extract values from the settled promises and create an object for the item
    let title = itemData[0].status === 'fulfilled' ? itemData[0].value : '';
    let description = itemData[1].status === 'fulfilled' ? itemData[1].value : '';
    let date = itemData[2].status === 'fulfilled' ? itemData[2].value : '';
    let star = itemData[3].status === 'fulfilled' ? itemData[3].value : ''; // This will be a percentage, e.g., "100%"
    let location = itemData[4].status === 'fulfilled' ? itemData[4].value : '';

    const cleanedData = {
      title: title?.trim(),
      description: description?.replace(/[\n\t]+/g, ' ').trim(),
      date: date?.trim(),
      star: star?.trim(),
      location: location?.replace(/[\n\t]+/g, ' ').trim()
    };

    // Push the item data object into the itemsData array
    itemsData.push(cleanedData);
  }

  const results = {
    url: page.url(),
    title: productTitle,
    image: imgs,
    price: dataPrice,
    from: productFrom,
    recommended: {
      percent,
      reviewers
    },
    sold,
    customer_satisfied,
    reviews: itemsData,
    type: 'best-selling'
  }

  console.log('🚀🚀 🚀  Got it! Storing product: ', results.title)
  const data = await Dataset.open('qoo10-products');
  await data.pushData(results);

  await data.exportToJSON('qoo10-batch-2')

  const hasNextPage = await page.$('li.p-item > a');
  if (hasNextPage) {
    await enqueueLinks({
      selector: 'li.p-item > a',
      label: 'SEARCH_LIST',
    })
  }
}

// Function to enqueue initial category pages
async function enqueueSearchResultProductPage({enqueueLinks}: Params) {
  const selector = 'li.p-item > a'

  await enqueueLinks({
    selector,
    label: 'SEARCH_LIST'
  })
}

export const url = `https://www.qoo10.sg/gmkt.inc/BestSellers/?g=3&banner_no=12025`

export const qooCrawler = {
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

    if (request.label === 'SEARCH_LIST') {
      await enqueueCategoryLinks({page, enqueueLinks})
    } else {
      await enqueueSearchResultProductPage({page, enqueueLinks})
    }
  },
  maxRequestsPerCrawl: 40, // Limit the number of requests to prevent infinite crawling in large sites,
  // headless: false
} satisfies PlaywrightCrawler