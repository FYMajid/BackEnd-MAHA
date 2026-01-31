import express, { NextFunction, Request, Response } from "express";
import * as rolePermissionService from "./service";
import { createRolePermissionSchema } from "./schema";

const router = express.Router();

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto = createRolePermissionSchema.parse(req.body);
    const rolePermission = await rolePermissionService.createRolePermission(dto);
    res.status(201).json(rolePermission);
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rolePermissions = await rolePermissionService.listRolePermissions();
    res.json(rolePermissions);
  } catch (error) {
    next(error);
  }
});

router.get(
  "/:roleId/:permissionId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const roleId = BigInt(String(req.params.roleId));
      const permissionId = BigInt(String(req.params.permissionId));
      const rolePermission = await rolePermissionService.getRolePermission(
        roleId,
        permissionId,
      );
      res.json(rolePermission);
    } catch (error) {
      next(error);
    }
  },
);

router.delete(
  "/:roleId/:permissionId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const roleId = BigInt(String(req.params.roleId));
      const permissionId = BigInt(String(req.params.permissionId));
      await rolePermissionService.deleteRolePermission(roleId, permissionId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
);

export default router;
