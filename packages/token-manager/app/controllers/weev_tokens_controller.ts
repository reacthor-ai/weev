import type { HttpContext } from "@adonisjs/core/http";
import { createWeevTokenValidator, removeWeevTokenValidator } from "#validators/weev_token";
import redis from "@adonisjs/redis/services/main";

export default class WeevTokensController {
  /**
   * Create weev-token
   * This is where we take the:
   * {userId}: this is coming from our backend side
   * {integrations}: type of integrations we can have: "shopee" | "lazada"
   * {uuId}: random uuid.
   */
  async create({ request, response }: HttpContext) {
    const data = request.all();
    const payload = await createWeevTokenValidator.validate(data);
    const id = `${payload.userId}-${payload.uuid}-${payload.integrations}`;
    redis.set(`weev-token-${payload.uuid}`, id);

    return response.status(200).send({
      success: true
    });
  }

  /**
   * Remove the weev-token.
   */
  async remove({ request, response }: HttpContext) {
    const data = request.all();
    const payload = await removeWeevTokenValidator.validate(data);

    await redis.del(`weev-token-${payload.userId}`);

    return response.status(200).send({
      success: true
    });
  }

  /**
   * Get the weev-token
   */
  async show({ response, params }: HttpContext) {
    const id = params.id;

    const userId = await redis.get(id);

    if (!userId) {
      return response.status(404).send({
        code: "USER_ID_NOT_FOUND",
        message: "No user id"
      });
    }

    return response.status(200).json({
      userId
    });
  }
}
