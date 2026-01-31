import express, { NextFunction, Request, Response } from "express";
import * as permissionService from "./service";
import { createPermissionSchema, updatePermissionSchema } from "./schema";

const router = express.Router();

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto = createPermissionSchema.parse(req.body);
    const permission = await permissionService.createPermission(dto);
    res.status(201).json(permission);
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const permissions = await permissionService.listPermissions();
    res.json(permissions);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = BigInt(String(req.params.id));
    const permission = await permissionService.getPermissionById(id);
    res.json(permission);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = BigInt(String(req.params.id));
    const dto = updatePermissionSchema.parse(req.body);
    const permission = await permissionService.updatePermission(id, dto);
    res.json(permission);
  } catch (error) {
    next(error);
  }
});

router.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = BigInt(String(req.params.id));
      await permissionService.deletePermission(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
);

export default router;
