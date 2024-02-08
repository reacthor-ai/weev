// Instead of CheerioCrawler let's use Playwright
// to be able to render JavaScript.
import {PlaywrightCrawler} from 'crawlee';
import {beyondCrawler, beyondUrl} from "./marketplace_beyond/index.js";

const crawler = new PlaywrightCrawler(beyondCrawler);

await crawler.run([beyondUrl])

