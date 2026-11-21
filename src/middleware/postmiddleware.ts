import { Position } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import { ForbiddenError } from "../error/ForbidenError";

export const authorizePosition = (...allowed: Position[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !allowed.includes(req.user.position)) {
      throw new ForbiddenError("Forbidden");
    }
    next();
  };
};
