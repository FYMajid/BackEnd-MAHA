import express, { NextFunction, Request, Response } from "express";
import * as loginLogService from "./service";
import { createLoginLogSchema, updateLoginLogSchema } from "./schema";

const router = express.Router();

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto = createLoginLogSchema.parse(req.body);
    const log = await loginLogService.createLoginLog(dto);
    res.status(201).json(log);
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const logs = await loginLogService.listLoginLogs();
    res.json(logs);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = BigInt(String(req.params.id));
    const log = await loginLogService.getLoginLogById(id);
    res.json(log);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = BigInt(String(req.params.id));
    const dto = updateLoginLogSchema.parse(req.body);
    const log = await loginLogService.updateLoginLog(id, dto);
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
      await loginLogService.deleteLoginLog(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
);

export default router;
