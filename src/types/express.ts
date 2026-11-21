import "express";
import { Role, Position } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: Role;
        position: Position;
      };

      file?: Express.Multer.File;
    }
  }
}

export {};
