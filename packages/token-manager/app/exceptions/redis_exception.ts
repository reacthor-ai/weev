import { Exception } from "@adonisjs/core/exceptions";
import { HttpContext } from "@adonisjs/core/http";

export const RedisErrorCodes = {
  REDIS_CREATE_ERROR: "REDIS_ERROR_CREATE_ERROR",
  REDIS_DEL_ERROR: "REDIS_DEL_ERROR",
  REDIS_GET_ERROR: "REDIS_GET_ERROR"
} as const;

export default class RedisException extends Exception {
  async handle(error: { status: number, code: typeof RedisErrorCodes, message: string }, ctx: HttpContext) {
    ctx.response.status(error.status).send({
      code: error.code,
      message: `Reason: ${error.message}`
    });
  }
}
