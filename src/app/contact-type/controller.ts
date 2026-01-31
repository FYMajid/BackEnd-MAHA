import express, { NextFunction, Request, Response } from "express";
import * as contactTypeService from "./service";
import { createContactTypeSchema, updateContactTypeSchema } from "./schema";

const router = express.Router();

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto = createContactTypeSchema.parse(req.body);
    const type = await contactTypeService.createContactType(dto);
    res.status(201).json(type);
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const types = await contactTypeService.listContactTypes();
    res.json(types);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = BigInt(String(req.params.id));
    const type = await contactTypeService.getContactTypeById(id);
    res.json(type);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = BigInt(String(req.params.id));
    const dto = updateContactTypeSchema.parse(req.body);
    const type = await contactTypeService.updateContactType(id, dto);
    res.json(type);
  } catch (error) {
    next(error);
  }
});

router.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = BigInt(String(req.params.id));
      await contactTypeService.deleteContactType(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
);

export default router;
