import "express";

declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId: bigint;
        organizationId?: bigint;
        permissions?: string[];
      };
    }
  }
}

export {};
