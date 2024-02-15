import {PlaywrightCrawler} from "crawlee";
import {Params} from "../types.js";
import {defaultBrowserPoolOptions} from "../util/constant.js";

async function enqueueMainPage({page}: Pick<Params, 'page'>) {
  await page.waitForSelector('#h-singlish-consolidated-list-make-a-quick-search', {timeout: 50000})

  const data = await page.$eval('tbody', (tbody) => {
    const rows = tbody.querySelectorAll('tr');

    return Array.from(rows).map((row) => {
      const columns = row.querySelectorAll('td');
      return {
        wordOrPhrase: columns[0].textContent.trim(),
        definition: columns[1].textContent.trim(),
        example: columns[2].textContent.trim(),
      };
    });
  });

  return data
}

export const guidesifyUrl = 'https://guidesify.com/singlish-phrases-define-singapore'

export const guidesifyCrawler = {
  // @ts-ignore
  browserPoolOptions: defaultBrowserPoolOptions,
  requestHandler: async ({page, request}) => {
    console.log(`Processing: ${request.url}`)
    const results = await enqueueMainPage({page})

    console.log({results})
  },
  maxRequestsPerCrawl: 3, // Limit the number of requests to prevent infinite crawling in large sites,
  // headless: false
} satisfies PlaywrightCrawler