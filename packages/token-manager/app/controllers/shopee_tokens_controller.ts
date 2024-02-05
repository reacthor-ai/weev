import type { HttpContext } from "@adonisjs/core/http";
import { createShopeeEndpointValidator, createShopeeTokenValidator, Endpoint } from "#validators/shopee_token";
import redis from "@adonisjs/redis/services/main";
import RedisException, { RedisErrorCodes } from "#exceptions/redis_exception";
import UnAuthorizedException, { UnAuthorizedErrorCodes } from "#exceptions/un_authorized_exception";

const endpointUrlMapping = {
  world: "https://partner.shopeemobile.com/api/v2/product/add_item",
  chinese_mainland: "https://openplatform.shopee.cn/api/v2/product/add_item",
  brazil: "https://openplatform.shopee.com.br/api/v2/product/add_item",
  test: "https://partner.test-stable.shopeemobile.com/api/v2/product/add_item",
  test_chinese_mainland: "https://openplatform.test-stable.shopee.cn/api/v2/product/add_item"
} as const;

type EndpointKey = keyof typeof endpointUrlMapping;

function isEndpointKey(key: any): key is EndpointKey {
  return key in endpointUrlMapping;
}

export default class ShopeeTokensController {

  /**
   * [POST] save shopee token.
   * Once we've successfully signed up we can save the token.
   * Which corresponds to the user. This is protected by the {@link WeevTokenMiddleware}.
   */
  async create({ request, response }: HttpContext) {
    try {
      const data = request.all();
      const payload = await createShopeeTokenValidator.validate(data);
      const name = `weev-token-shopee-${payload.user_id}`;

      await redis.set(name, JSON.stringify(payload));

      return response.status(200).json({
        tokenName: name
      });
    } catch (error) {
      throw new RedisException(`${error}`, {
        status: 500,
        code: RedisErrorCodes.REDIS_CREATE_ERROR
      });
    }
  }

  async setEndpoint({ request, response }: HttpContext) {
    try {
      const data = request.all();
      const { endpoint: endpointKey, user_id } = await createShopeeEndpointValidator.validate(data);

      await redis.set(`weev-endpoint-shopee-${user_id}`, endpointKey);
      return response.status(200).json({
        success: true
      });
    } catch (error) {
      throw new UnAuthorizedException(`${error} Needs to be one of these: ${Endpoint.toString()}`, {
        status: 500,
        code: UnAuthorizedErrorCodes.INTERNAL_SERVER_ERROR
      });
    }
  }

  /**
   * [Get] shopee token.
   *
   * This is protected by the {@link WeevIntegrationsTokenMiddleware}.
   */
  async show({ response }: HttpContext) {
    try {
      const shopeeInfo = response.ctx ? (response.ctx as unknown as any).info : null;

      return response.status(200).json({
        shopeeInfo
      });
    } catch (error) {
      throw new UnAuthorizedException(`${error}`, {
        status: 500,
        code: UnAuthorizedErrorCodes.INTERNAL_SERVER_ERROR
      });
    }
  }

  /**
   * List out the shopee endpoints by regions.
   */
  async endpoint({ response }: HttpContext) {
    try {
      const shopeeInfo = response.ctx ? (response.ctx as unknown as any).info : null;

      const endpointKey = await redis.get(`weev-endpoint-shopee-${shopeeInfo.user_id}`);

      if (endpointKey && isEndpointKey(endpointKey)) {
        const url = endpointUrlMapping[endpointKey];
        return response.json({ url });
      } else {
        return response.json({ url: null });
      }
    } catch (error) {
      throw new UnAuthorizedException(`${error}`, {
        status: 500,
        code: UnAuthorizedErrorCodes.INTERNAL_SERVER_ERROR
      });
    }
  }
}
