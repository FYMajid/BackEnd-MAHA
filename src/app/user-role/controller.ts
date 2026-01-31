import express, { NextFunction, Request, Response } from "express";
import * as userRoleService from "./service";
import { createUserRoleSchema } from "./schema";

const router = express.Router();

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto = createUserRoleSchema.parse(req.body);
    const userRole = await userRoleService.createUserRole(dto);
    res.status(201).json(userRole);
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userRoles = await userRoleService.listUserRoles();
    res.json(userRoles);
  } catch (error) {
    next(error);
  }
});

router.get(
  "/:userId/:roleId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = BigInt(String(req.params.userId));
      const roleId = BigInt(String(req.params.roleId));
      const userRole = await userRoleService.getUserRole(userId, roleId);
      res.json(userRole);
    } catch (error) {
      next(error);
    }
  },
);

router.delete(
  "/:userId/:roleId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = BigInt(String(req.params.userId));
      const roleId = BigInt(String(req.params.roleId));
      await userRoleService.deleteUserRole(userId, roleId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
);

export default router;
