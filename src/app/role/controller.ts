import express, { NextFunction, Request, Response } from "express";
import * as roleService from "./service";
import { createRoleSchema, updateRoleSchema } from "./schema";

const router = express.Router();

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto = createRoleSchema.parse(req.body);
    const role = await roleService.createRole(dto);
    res.status(201).json(role);
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const roles = await roleService.listRoles();
    res.json(roles);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = BigInt(String(req.params.id));
    const role = await roleService.getRoleById(id);
    res.json(role);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = BigInt(String(req.params.id));
    const dto = updateRoleSchema.parse(req.body);
    const role = await roleService.updateRole(id, dto);
    res.json(role);
  } catch (error) {
    next(error);
  }
});

router.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = BigInt(String(req.params.id));
      await roleService.deleteRole(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
);

export default router;
