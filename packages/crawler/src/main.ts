// Instead of CheerioCrawler let's use Playwright
// to be able to render JavaScript.
import {PlaywrightCrawler} from 'crawlee';
import {naiiCrawler} from "./marketplace_naii/index.js";

const crawler = new PlaywrightCrawler(naiiCrawler);

await crawler.run(['https://naiise.com/collections/furball-collective'])

