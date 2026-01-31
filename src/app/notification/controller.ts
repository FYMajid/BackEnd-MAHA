import express, { NextFunction, Request, Response } from "express";
import * as notificationService from "./service";
import { createNotificationSchema, updateNotificationSchema } from "./schema";

const router = express.Router();

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto = createNotificationSchema.parse(req.body);
    const notification = await notificationService.createNotification(dto);
    res.status(201).json(notification);
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const notifications = await notificationService.listNotifications();
    res.json(notifications);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = BigInt(String(req.params.id));
    const notification = await notificationService.getNotificationById(id);
    res.json(notification);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = BigInt(String(req.params.id));
    const dto = updateNotificationSchema.parse(req.body);
    const notification = await notificationService.updateNotification(id, dto);
    res.json(notification);
  } catch (error) {
    next(error);
  }
});

router.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = BigInt(String(req.params.id));
      await notificationService.deleteNotification(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
);

export default router;
