import express, { NextFunction, Request, Response } from "express";
import * as organizationService from "./service";
import { createOrganizationSchema, updateOrganizationSchema } from "./schema";

const router = express.Router();

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto = createOrganizationSchema.parse(req.body);
    const organization = await organizationService.createOrganization(dto);
    res.status(201).json(organization);
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const organizations = await organizationService.listOrganizations();
    res.json(organizations);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = BigInt(String(req.params.id));
    const organization = await organizationService.getOrganizationById(id);
    res.json(organization);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = BigInt(String(req.params.id));
    const dto = updateOrganizationSchema.parse(req.body);
    const organization = await organizationService.updateOrganization(id, dto);
    res.json(organization);
  } catch (error) {
    next(error);
  }
});

router.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = BigInt(String(req.params.id));
      await organizationService.deleteOrganization(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
);

export default router;
