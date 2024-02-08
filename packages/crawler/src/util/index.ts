import {Page} from "playwright";

export const trim = (s: string) => s.trim().replace(/\s+/g, ' ')

export const MarketPlaceLabel = {
  CATEGORY: 'CATEGORY',
  PRODUCT_DETAIL: 'PRODUCT_DETAIL'
} as const

// Utility function to extract text content
export async function getTextContent(page: Page, selector: string, defaultValue = '') {
  return page.locator(selector).textContent().then(text => text?.trim() ?? defaultValue);
}

// Utility function to get an attribute value
export async function getAttributeValue(page: Page, selector: string, attribute: string, defaultValue = '') {
  return page.getAttribute(selector, attribute).then(value => value ?? defaultValue);
}

// Function to handle Promise.allSettled results
export function getFulfilledValue(result, defaultValue = '') {
  return result.status === 'fulfilled' ? result.value ?? defaultValue : defaultValue;
}

// Function to scroll to and wait for a selector
export async function scrollToAndWaitForSelector(page: Page, selector: string) {
  await page.evaluate(selector => {
    document.querySelector(selector)?.scrollIntoView();
  }, selector);
  await page.waitForSelector(selector, {state: 'visible'});
}