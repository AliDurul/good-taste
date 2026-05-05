declare namespace Express {
  interface Request {
    validatedBody?: any;
    user?: {
      id: string;
      email: string;
      name?: string;
      role?: string;
    };
    session?: unknown;
  }
}