import {EnqueueLinksOptions} from "@crawlee/core";
import {BatchAddRequestsResult} from "@crawlee/types";
import {Page} from "playwright";

export type Params = {
  enqueueLinks(options?: EnqueueLinksOptions): Promise<BatchAddRequestsResult>
  page: Page
}