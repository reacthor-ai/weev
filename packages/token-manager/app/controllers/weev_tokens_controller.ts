import type { HttpContext } from "@adonisjs/core/http";
import { createWeevTokenValidator, removeWeevTokenValidator } from "#validators/weev_token";
import redis from "@adonisjs/redis/services/main";
import { uuid } from "uuidv4";

import RedisException, { RedisErrorCodes } from "#exceptions/redis_exception";
import { errors } from "@vinejs/vine";
import UnAuthorizedException from "#exceptions/un_authorized_exception";

export default class WeevTokensController {
  /**
   * Create weev-token
   * This is where we take the:
   * {userId}: this is coming from our backend side
   * {integrations}: type of integrations we can have: "shopee" | "lazada"
   * {uuId}: random uuid.
   */
  async create({ request, response }: HttpContext) {

    try {
      const data = request.all();
      const payload = await createWeevTokenValidator.validate(data);
      const uniqueUUID = uuid().slice(0, 7).replaceAll("-", "");
      const id = `pk_${payload.userId}_${uniqueUUID}`;
      const name = `weev-token-${payload.userId}`;
      /**
       * Redis key will expire after 3 days.
       */
      await redis.set(name, id, "EX", 259200);

      return response.status(200).json({
        tokenId: id
      });
    } catch (error) {

      if (error instanceof errors.E_VALIDATION_ERROR) {
        throw new UnAuthorizedException(`${error}, [userId = string, integrations = 'SHOPEE' || 'LAZADA'] required`, {
          status: 500,
          code: "Validation error"
        });
      }

      throw new RedisException(`${error}`, {
        status: 500,
        code: RedisErrorCodes.REDIS_CREATE_ERROR
      });
    }
  }

  /**
   * Remove the weev-token.
   */
  async remove({ request, response }: HttpContext) {
    const data = request.all();
    const payload = await removeWeevTokenValidator.validate(data);

    try {
      await redis.del(`weev-token-${payload.userId}`);

      return response.status(200).send({
        success: true
      });
    } catch (error) {
      throw new RedisException(`${error}`, {
        status: 500,
        code: RedisErrorCodes.REDIS_DEL_ERROR
      });
    }
  }

  /**
   * Get the weev-token
   */
  async show({ response, params }: HttpContext) {
    const id = params.id;

    try {
      const tokenId = await redis.get(id);

      return response.status(200).json({
        tokenId
      });
    } catch (error) {
      throw new RedisException(`${error}`, {
        status: 500,
        code: RedisErrorCodes.REDIS_GET_ERROR
      });
    }
  }
}
