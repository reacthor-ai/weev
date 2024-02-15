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

const trainingDataOne = {
  "input": {
    "title": "Sports Duffle Bag",
    "description": "Spacious and durable duffle bag perfect for the gym, sports, or travel."
  },
  "output": "Solid Gym Bag lah!  Wah this bag power sia!  Can put everything, good for gym or travelling also can.",
  "formality": "casual",
  "task": "translate", // or generate
}

const trainingExampleData =
  {
    "title": "Sports Duffle Bag",
    "price": "932.09 SGD",
    "description": "Spacious and durable duffle bag perfect for the gym, sports, or travel.",
    "image": [
      "https://gd.image-gmkt.com/UNDER-ARMOUR-BAG-UNDER-ARMOUR-GYM-BAG-UNDER-ARMOUR-DUFFLE-BAG/li/766/353/1454353766.g_350-w-et-pj_g.jpg",
      "https://gd.image-gmkt.com/UNDER-ARMOUR-BAG-UNDER-ARMOUR-GYM-BAG-UNDER-ARMOUR-DUFFLE-BAG/li/766/353/1454353766.g_50-w-st_g.jpg",
      "https://gd.image-gmkt.com/UNDER-ARMOUR-BAG-UNDER-ARMOUR-GYM-BAG-UNDER-ARMOUR-DUFFLE-BAG/ai/077/529/1730529077_00.g_50-w-st-pj_g.jpg"
    ],
    "from": "Sengkang, Singapore",
    "recommended": {
      "percent": "95%",
      "reviewers": "(69)"
    },
    "sold": "21",
    "customer_satisfied": "90%",
    "brandVoice": ["sporty", "performance-driven"],
    "competitorCopy": [
      "Power Your Workout: The Ultimate Gym Bag",
      "Gear Up: Durable Sports Duffle",
      "Active Lifestyle Essential: Versatile Duffle Bag",
    ],
    "singlishOption": "yes",
    "singlishIntensity": "mild",
    "currentTrends": ["Athleisure", "Fitness Gear"],
    "recommendedProducts": [],
    "regulatoryRestrictions": [
      "Clear identification of advertisements (if applicable)",
      "Transparent pricing",
      "Avoid unsubstantiated claims",
      "Respectful and truthful language"
    ],
    "singlishLabels": ["steady", "can lah", "solid"],
    "singlishDescription": "This gym bag damn steady one, can fit all your stuff! Good for workout, can also use for travel.",
    "market": "singapore",
    "singlishTitle": "Solid Gym Bag",
  }
