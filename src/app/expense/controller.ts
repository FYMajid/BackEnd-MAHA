import express, { NextFunction, Request, Response } from "express";
import * as expenseService from "./service";
import { createExpenseSchema, updateExpenseSchema } from "./schema";

const router = express.Router();

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto = createExpenseSchema.parse(req.body);
    const expense = await expenseService.createExpense(dto);
    res.status(201).json(expense);
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const expenses = await expenseService.listExpenses();
    res.json(expenses);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = BigInt(String(req.params.id));
    const expense = await expenseService.getExpenseById(id);
    res.json(expense);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = BigInt(String(req.params.id));
    const dto = updateExpenseSchema.parse(req.body);
    const expense = await expenseService.updateExpense(id, dto);
    res.json(expense);
  } catch (error) {
    next(error);
  }
});

router.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = BigInt(String(req.params.id));
      await expenseService.deleteExpense(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
);

export default router;
