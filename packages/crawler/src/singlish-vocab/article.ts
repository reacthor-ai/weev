import {defaultBrowserPoolOptions} from "../util/constant.js";
import {Dataset, PlaywrightCrawler} from "crawlee";
import {Params} from "../types.js";
import {Page} from "playwright";

export const articleUrls = [
  'https://www.uobgroup.com/asean-insights/articles/acss-2023-singapore.page',
  'https://www.reeracoen.sg/en/articles/consumer-trends-2023',
  'https://business.yougov.com/content/46825-two-in-five-consumers-in-singapore-report-decrease-in-disposable-income-in-the-past-12-months?redirect_from=%2Fcontent%2F8480-two-in-five-consumers-in-singapore-report-decrease-in-disposable-income-in-the-past-12-months',
  'https://datastorageasean.com/news-press-releases/customers-singapore-want-personalisation-data-security-and-speed-businesses',
  'https://www.cali.sg/blog/a-quick-guide-to-understanding-the-food-culture-in-singapore',
  'https://crmleadgen.com/blog/marketing/sophisticated-but-price-conscious-buying-behavior-in-singapore/',
  'https://www.foodnavigator-asia.com/Article/2023/11/07/Singapore-consumers-e-commerce-purchasing-decisions-increasingly-driven-by-health-and-sustainability-RedMart',
  'https://www.dsgpay.com/blog/singaporean-consumer-trends/',
  'https://www.jumppoint.io/resource-center/the-growth-and-potential-of-singapores-ecommerce-market-in-2024',
  'https://www.ipsos.com/en-sg/singaporeans-outlook-2024-top-worries-remain-new-perspectives-ai-data-privacy-and-role-technology',
  'https://www.mordorintelligence.com/industry-reports/singapore-ecommerce-market',
  'https://employmenthero.com/sg/blog/office-lingo-best-phrases/'
]

async function articleContentPage(page: Page, title: string, waitSelectorTag: string, articleTag: string) {
  await page.waitForLoadState('domcontentloaded')
  let article = ''
  try {
    await page.waitForSelector(waitSelectorTag)

    article = await page.locator(articleTag).innerText()
  } catch (error) {
    console.log('Error', error)
  }

  return {articleName: title, articleText: article}
}

async function enqueueMainPage({page}: Pick<Params, 'page'>) {
  const [
    uobGroup,
    reerAcoen,
    businessYouGov,
    datatStorageAsean,
    caliGuide,
    crmLeadgen,
    foodNavigator,
    dsgPay,
    jumpSuit,
    ipsos,
    mordorintelligence
  ] = articleUrls

  const url = page.url();
  const title = await page.title()

  const executeArticleCrawler = {
    [uobGroup]: async (page: Page, title: string) => articleContentPage(
      page,
      title,
      '.article-single-post',
      '.article-single-content'
    ),
    [reerAcoen]: async (page: Page, title: string) => articleContentPage(
      page,
      title,
      '#article',
      '.content'
    ),
    [businessYouGov]: async (page: Page, title: string) => articleContentPage(
      page,
      title,
      '.article-section',
      '.content-container'
    ),
    [datatStorageAsean]: async (page: Page, title: string) => articleContentPage(
      page,
      title,
      '#block-system-main',
      '.node-news-press-releases'
    ),
    [caliGuide]: async (page: Page, title: string) => articleContentPage(
      page,
      title,
      '.blog-detail',
      '.blog-detail'
    ),
    [crmLeadgen]: async (page: Page, title: string) => articleContentPage(
      page,
      title,
      'div[data-elementor-type="wp-post"]',
      'div[data-elementor-type="wp-post"]'
    ),
    [foodNavigator]: async (page: Page, title: string) => articleContentPage(
      page,
      title,
      '.Detail-content',
      '.Detail-content'
    ),
    [dsgPay]: async (page: Page, title: string) => articleContentPage(
      page,
      title,
      '.mbPostContent',
      '.mbPostContent'
    ),
    [jumpSuit]: async (page: Page, title: string) => articleContentPage(
      page,
      title,
      'div[data-w-id="10e2f763-e8d0-9686-10db-ef18e375913b"]',
      'div[data-w-id="10e2f763-e8d0-9686-10db-ef18e375913b"]'
    ),
    [ipsos]: async (page: Page, title: string) => articleContentPage(
      page,
      title,
      'section.block-publications-content',
      'section.block-publications-content'
    ),
    [mordorintelligence]: async (page: Page, title: string) => articleContentPage(
      page,
      title,
      '#component-2',
      '#component-2'
    )
  }

  const res = await executeArticleCrawler[url](page, title)
  return res
}

export const articleCrawler = {
  // @ts-ignore
  browserPoolOptions: defaultBrowserPoolOptions,
  requestHandler: async ({page, request}) => {
    console.log(`Processing: ${request.url}`)
    const data = await Dataset.open('singapore-articles-2');
    const res = await enqueueMainPage({page})

    console.log({'Success celebrate!': res.articleName})

    let currentUrl = articleUrls.findIndex(s => s === request.url)
    if (request.url === articleUrls[currentUrl]) {
      await data.pushData(res);
    }

    const lastUrl = articleUrls[articleUrls.length - 1]
    if (request.url === lastUrl) {
      await data.exportToCSV('singapore-articles')
    }
  },
  maxRequestsPerCrawl: 24, // Limit the number of requests to prevent infinite crawling in large sites,
  // headless: false
} satisfies PlaywrightCrawler