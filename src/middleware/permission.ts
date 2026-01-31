import { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma";

const publicRoutes = new Set([
  "POST /api/users/register",
  "POST /api/users/login",
  "POST /api/auth/refresh",
  "POST /api/auth/logout",
]);

const methodToAction: Record<string, string> = {
  GET: "read",
  POST: "create",
  PUT: "update",
  PATCH: "update",
  DELETE: "delete",
};

const isPublicRoute = (req: Request) => {
  const path = `${req.baseUrl}${req.path}`;
  return publicRoutes.has(`${req.method.toUpperCase()} ${path}`);
};

const getResourceName = (req: Request) => {
  const parts = req.path.split("/").filter(Boolean);
  return parts[0] ?? "";
};

const getPermissionCode = (req: Request) => {
  const resource = getResourceName(req);
  const action = methodToAction[req.method.toUpperCase()];
  if (!resource || !action) {
    return null;
  }
  return `${resource}.${action}`;
};

const fetchUserPermissions = async (userId: bigint) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      isActive: true,
      roles: {
        select: {
          role: {
            select: {
              permissions: {
                select: {
                  permission: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!user || !user.isActive) {
    return null;
  }

  const codes = new Set<string>();
  user.roles.forEach((userRole) => {
    userRole.role.permissions.forEach((rolePermission) => {
      codes.add(rolePermission.permission.code);
    });
  });

  return Array.from(codes);
};

export const permissionGuard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (isPublicRoute(req)) {
    return next();
  }

  if (!req.auth?.userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const permissionCode = getPermissionCode(req);
  if (!permissionCode || permissionCode.startsWith("auth.")) {
    return next();
  }

  const permissions =
    req.auth.permissions ?? (await fetchUserPermissions(req.auth.userId));

  if (!permissions) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  req.auth.permissions = permissions;

  if (!permissions.includes(permissionCode)) {
    return res.status(403).json({
      success: false,
      message: "Forbidden",
    });
  }

  return next();
};

export const requirePermissions = (codes: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.auth?.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const permissions =
      req.auth.permissions ?? (await fetchUserPermissions(req.auth.userId));

    if (!permissions) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    req.auth.permissions = permissions;

    const allowed = codes.every((code) => permissions.includes(code));
    if (!allowed) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    return next();
  };
