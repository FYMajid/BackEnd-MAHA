import express, { NextFunction, Request, Response } from "express";
import * as taskService from "./service";
import { createTaskSchema, updateTaskSchema } from "./schema";

const router = express.Router();

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto = createTaskSchema.parse(req.body);
    const task = await taskService.createTask(dto);
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tasks = await taskService.listTasks();
    res.json(tasks);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = BigInt(String(req.params.id));
    const task = await taskService.getTaskById(id);
    res.json(task);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = BigInt(String(req.params.id));
    const dto = updateTaskSchema.parse(req.body);
    const task = await taskService.updateTask(id, dto);
    res.json(task);
  } catch (error) {
    next(error);
  }
});

router.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = BigInt(String(req.params.id));
      await taskService.deleteTask(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
);

export default router;
