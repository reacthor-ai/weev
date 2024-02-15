import {EnqueueLinksOptions} from "@crawlee/core";
import {BatchAddRequestsResult} from "@crawlee/types";
import {Page} from "playwright";

export type Params = {
  enqueueLinks(options?: EnqueueLinksOptions): Promise<BatchAddRequestsResult>
  page: Page
}

export type ProductsResults = {
  title: string
  currency: string
  price: {
    currentPrice: string
    discountedPrice?: string
  }
  description: string | string[]
  images: string[]
  recommended: unknown[]

  description_2?: string
  availability?: string
  marketplace?: unknown
  rating?: string
  reviews?: unknown[]
}

export type TrainingProductType = {
  title: string;
  price: string;
  description: string;
  image: string[];
  from: string;
  recommended: {
    percent: string;
    reviewers: string;
  };
  sold: string;
  customer_satisfied: string;
  brandVoice: string[];
  competitorCopy: string[];
  singlishOption: string;
  singlishIntensity: string;
  currentTrends: string[];
  recommendedProducts: unknown[];
  regulatoryRestrictions: string[];
  singlishLabels: string[];
  singlishDescription: string;
  market: string;
  singlishTitle: string;
};
