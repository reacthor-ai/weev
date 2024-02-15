import {PlaywrightCrawler} from "crawlee";
import {Params} from "../types.js";
import {defaultBrowserPoolOptions} from "../util/constant.js";

async function enqueueMainPage({page}: Pick<Params, 'page'>) {
  await page.waitForSelector('article')

  const articlesData = await page.$$eval('.articleContent', (articles) => {
    return articles.map((article) => {
      const title = article.querySelector('h3[data-testid="tile-title_testID"]')!.textContent.trim() ?? '';
      const summary = article.querySelector('p[data-testid="summary_testID"]')!?.textContent.trim() ?? '';
      let meaning, example;

      const strongElements = article.querySelectorAll('strong');

      for (const strongElement of strongElements) {
        const strongText = strongElement.textContent.trim();

        if (strongText === 'Meaning') {
          meaning = strongElement.nextSibling.textContent.trim().replace(':', '');
        } else if (strongText === 'Example') {
          example = strongElement.nextSibling.textContent.trim().replace(':', '');
        }
      }

      return {
        wordOrPhrase: title,
        definition: meaning,
        example: example,
        summary
      };
    });
  });

  // articleContent
  const results = {
    data: articlesData
  }

  return results
}

export const timeoutUrl = 'https://www.timeout.com/singapore/things-to-do/common-singlish-words-you-need-to-know-to-speak-like-a-local'

export const timeoutCrawler = {
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