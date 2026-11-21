import { Role } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import { ForbiddenError } from "../error/ForbidenError";

export const authorizeRole = (...allowed: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !allowed.includes(req.user.role)) {
      throw new ForbiddenError("Forbidden");
    }
    next();
  };
};
