import express, { NextFunction, Request, Response } from "express";
import * as matterService from "./service";
import { createMatterSchema, updateMatterSchema } from "./schema";

const router = express.Router();

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto = createMatterSchema.parse(req.body);
    const matter = await matterService.createMatter(dto);
    res.status(201).json(matter);
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const matters = await matterService.listMatters();
    res.json(matters);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = BigInt(String(req.params.id));
    const matter = await matterService.getMatterById(id);
    res.json(matter);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = BigInt(String(req.params.id));
    const dto = updateMatterSchema.parse(req.body);
    const matter = await matterService.updateMatter(id, dto);
    res.json(matter);
  } catch (error) {
    next(error);
  }
});

router.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = BigInt(String(req.params.id));
      await matterService.deleteMatter(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
);

export default router;
