import type { HttpContext } from "@adonisjs/core/http";
import { Clerk } from "@clerk/clerk-sdk-node";
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

    const user = await this._verifyToken(token, ctx);

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
  }

  private async _verifyToken(token: string, ctx: HttpContext) {
    const jwtToken = await clerkClient.verifyToken(token);

    if (!jwtToken) {
      return ctx.response.status(401).send({
        code: "UNAUTHORIZED",
        message: "Only authenticated users can save weev token"
      });
    }

    const client = await clerkClient.clients.verifyClient(jwtToken.__raw);

    /**
     * Make sure the client exists in our clerk sessions.
     */
    if (!client) {
      return ctx.response.status(401).send({
        code: "UNAUTHORIZED",
        message: "Only authenticated users can save weev token"
      });
    }

    const sessionId = client.lastActiveSessionId;

    if (!sessionId) {
      return ctx.response.status(401).send({
        code: "UNAUTHORIZED",
        message: "Only authenticated users can save weev token"
      });
    }

    const session = await clerkClient.sessions.verifySession(sessionId, token);

    /**
     * Make sure the session exists
     * and is valid a valid one.
     */
    if (!session) {
      return ctx.response.status(401).send({
        code: "UNAUTHORIZED",
        message: "Only authenticated users can save weev token"
      });
    }

    return session;
  }
}
