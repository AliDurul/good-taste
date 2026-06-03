import type { auth } from "../lib/auth";

declare global {
  namespace Express {
    interface Request {
      validatedBody?: any;
      user?: typeof auth.$Infer.Session.user;
      session?: typeof auth.$Infer.Session.session;
      headers?: Record<string, string>;
      pagination: {
        page: number;
        limit: number;
        skip: number;
      };
    }
  }
}

export {};
