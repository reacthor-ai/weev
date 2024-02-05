import type { HttpContext } from "@adonisjs/core/http";
import { Clerk } from "@clerk/clerk-sdk-node";
import { NextFn } from "@adonisjs/core/types/http";
import UnAuthorizedException, { UnAuthorizedErrorCodes } from "#exceptions/un_authorized_exception";

const clerkClient = Clerk({
  secretKey: process.env.CLERK_SECRET_KEY
});

export default class WeevTokenMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const token = ctx.request.headers()["authorization"];

    if (!token) {
      throw new UnAuthorizedException("The token does not exist. Did you forget to add it in your headers?", {
        code: UnAuthorizedErrorCodes.TOKEN_NOT_FOUND,
        status: 401
      });
    }

    try {
      const sanitizedToken = token.replace("Bearer ", "");

      /**
       * Verify the token from clerk-auth.
       */
      await clerkClient.verifyToken(sanitizedToken);

      /**
       * Call next method in the pipeline.
       */
      return next();
    } catch (error) {
      throw new UnAuthorizedException(`${error}`, {
        status: 500,
        code: UnAuthorizedErrorCodes.INTERNAL_SERVER_ERROR
      });
    }
  }
}
