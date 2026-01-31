import express, { NextFunction, Request, Response } from "express";
import * as sessionService from "./service";
import { createSessionSchema, updateSessionSchema } from "./schema";

const router = express.Router();

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto = createSessionSchema.parse(req.body);
    const session = await sessionService.createSession(dto);
    res.status(201).json(session);
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessions = await sessionService.listSessions();
    res.json(sessions);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = BigInt(String(req.params.id));
    const session = await sessionService.getSessionById(id);
    res.json(session);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = BigInt(String(req.params.id));
    const dto = updateSessionSchema.parse(req.body);
    const session = await sessionService.updateSession(id, dto);
    res.json(session);
  } catch (error) {
    next(error);
  }
});

router.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = BigInt(String(req.params.id));
      await sessionService.deleteSession(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
);

export default router;
