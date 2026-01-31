import express, { NextFunction, Request, Response } from "express";
import * as activityLogService from "./service";
import { createActivityLogSchema, updateActivityLogSchema } from "./schema";

const router = express.Router();

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto = createActivityLogSchema.parse(req.body);
    const log = await activityLogService.createActivityLog(dto);
    res.status(201).json(log);
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const logs = await activityLogService.listActivityLogs();
    res.json(logs);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = BigInt(String(req.params.id));
    const log = await activityLogService.getActivityLogById(id);
    res.json(log);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = BigInt(String(req.params.id));
    const dto = updateActivityLogSchema.parse(req.body);
    const log = await activityLogService.updateActivityLog(id, dto);
    res.json(log);
  } catch (error) {
    next(error);
  }
});

router.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = BigInt(String(req.params.id));
      await activityLogService.deleteActivityLog(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
);

export default router;
