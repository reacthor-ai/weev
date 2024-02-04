import type { HttpContext } from "@adonisjs/core/http";
import { Clerk, Session } from "@clerk/clerk-sdk-node";
import { NextFn } from "@adonisjs/core/types/http";

const clerkClient = Clerk({
  secretKey: process.env.CLERK_SECRET_KEY
});

export default class WeevTokenMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const token = ctx.request.headers()["authorization"];

    if (!token) {
      return ctx.response.status(401).send({
        code: "UNAUTHORIZED",
        message: `No Token`
      });
    }

    try {
      const user = await this._verifyToken(token);

      if (!user) {
        return ctx.response.status(401).send({
          code: "UNAUTHORIZED",
          message: "Only authenticated users can save weev token"
        });
      }

      /**
       * Call next method in the pipeline and return its output
       */
      return next();
    } catch (error) {
      return ctx.response.status(401).send({
        code: "INTERNAL_SERVER_ERROR",
        message: `Reason: ${error}`
      });
    }
  }

  private async _verifyToken(token: string): Promise<Session | null> {
    const jwtToken = await clerkClient.verifyToken(token);

    if (!jwtToken) return null;

    const client = await clerkClient.clients.verifyClient(jwtToken.__raw);

    /**
     * Make sure the client exists in our clerk sessions.
     */
    if (!client) return null;

    const sessionId = client.lastActiveSessionId;

    if (!sessionId) return null;

    return await clerkClient.sessions.verifySession(sessionId, token);
  }
}
