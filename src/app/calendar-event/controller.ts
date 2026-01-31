import express, { NextFunction, Request, Response } from "express";
import * as calendarEventService from "./service";
import {
  createCalendarEventSchema,
  updateCalendarEventSchema,
} from "./schema";

const router = express.Router();

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto = createCalendarEventSchema.parse(req.body);
    const event = await calendarEventService.createCalendarEvent(dto);
    res.status(201).json(event);
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const events = await calendarEventService.listCalendarEvents();
    res.json(events);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = BigInt(String(req.params.id));
    const event = await calendarEventService.getCalendarEventById(id);
    res.json(event);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = BigInt(String(req.params.id));
    const dto = updateCalendarEventSchema.parse(req.body);
    const event = await calendarEventService.updateCalendarEvent(id, dto);
    res.json(event);
  } catch (error) {
    next(error);
  }
});

router.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = BigInt(String(req.params.id));
      await calendarEventService.deleteCalendarEvent(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
);

export default router;
