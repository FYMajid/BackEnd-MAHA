import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../lib/auth";

const publicRoutes = new Set([
  "POST /api/users/register",
  "POST /api/users/login",
  "POST /api/auth/refresh",
  "POST /api/auth/logout",
]);

const isPublicRoute = (req: Request) => {
  const path = `${req.baseUrl}${req.path}`;
  return publicRoutes.has(`${req.method.toUpperCase()} ${path}`);
};

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (isPublicRoute(req)) {
    return next();
  }

  const header = req.headers.authorization ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  try {
    const payload = verifyAccessToken(token);
    const userId = payload.sub ? BigInt(String(payload.sub)) : null;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    req.auth = {
      userId,
      organizationId: payload.orgId ? BigInt(String(payload.orgId)) : undefined,
    };

    return next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};
