import type { HttpContext } from "@adonisjs/core/http";
import router from "@adonisjs/core/services/router";

import WeevTokensController from "#controllers/weev_tokens_controller";
import { middleware } from "#start/kernel";
import ShopeeTokensController from "#controllers/shopee_tokens_controller";

router.get("/health", async ({ response }: HttpContext) => {
  response.send({
    body: "works!"
  });
});

/**
 * Weev token routes protected by
 * a middleware a user needs to be
 * signed in our backend before accessing this route.
 */
router.get("/weev-token/show/:id", [
  WeevTokensController, "show"
]).use(middleware.weevToken());

router.post("/weev-token/create", [
  WeevTokensController, "create"
]).use(middleware.weevToken());

router.post("/weev-token/remove", [
  WeevTokensController, "remove"
]).use(middleware.weevToken());

/**
 * Shopee token / integrations.
 *
 */
router.post("/shopee-token/save", [
  ShopeeTokensController, "create"
]).use(middleware.weevToken());

router.post("/shopee-token/endpoint/create", [
  ShopeeTokensController, "setEndpoint"
]).use(middleware.weevToken());

router.post("/shopee-token/endpoint", [
  ShopeeTokensController, "endpoint"
]).use(middleware.shopeeToken());

router.post("/shopee-token", [
  ShopeeTokensController, "show"
]).use(middleware.shopeeToken());
