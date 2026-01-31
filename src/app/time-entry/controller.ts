import express, { NextFunction, Request, Response } from "express";
import * as timeEntryService from "./service";
import { createTimeEntrySchema, updateTimeEntrySchema } from "./schema";

const router = express.Router();

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto = createTimeEntrySchema.parse(req.body);
    const entry = await timeEntryService.createTimeEntry(dto);
    res.status(201).json(entry);
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const entries = await timeEntryService.listTimeEntries();
    res.json(entries);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = BigInt(String(req.params.id));
    const entry = await timeEntryService.getTimeEntryById(id);
    res.json(entry);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = BigInt(String(req.params.id));
    const dto = updateTimeEntrySchema.parse(req.body);
    const entry = await timeEntryService.updateTimeEntry(id, dto);
    res.json(entry);
  } catch (error) {
    next(error);
  }
});

router.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = BigInt(String(req.params.id));
      await timeEntryService.deleteTimeEntry(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
);

export default router;
