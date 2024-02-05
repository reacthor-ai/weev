import { Exception } from "@adonisjs/core/exceptions";
import { HttpContext } from "@adonisjs/core/http";

export const UnAuthorizedErrorCodes = {
  USER_NOT_FOUND: "USER_NOT_FOUND",
  CREATE_USER_ERROR: "CREATE_USER_ERROR",
  TOKEN_NOT_FOUND: "TOKEN_NOT_FOUND",
  SESSION_NOT_FOUND: "SESSION_NOT_FOUND",
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
  VALIDATION_ERROR: "VALIDATION_ERROR"
} as const;

export default class UnAuthorizedException extends Exception {
  async handle(error: { status: number, code: typeof UnAuthorizedErrorCodes, message: string }, ctx: HttpContext) {
    ctx.response.status(error.status).send({
      code: error.code,
      message: `Reason: ${error.message}`
    });
  }
}
