import express, { NextFunction, Request, Response } from "express";
import * as paymentService from "./service";
import { createPaymentSchema, updatePaymentSchema } from "./schema";

const router = express.Router();

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto = createPaymentSchema.parse(req.body);
    const payment = await paymentService.createPayment(dto);
    res.status(201).json(payment);
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payments = await paymentService.listPayments();
    res.json(payments);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = BigInt(String(req.params.id));
    const payment = await paymentService.getPaymentById(id);
    res.json(payment);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = BigInt(String(req.params.id));
    const dto = updatePaymentSchema.parse(req.body);
    const payment = await paymentService.updatePayment(id, dto);
    res.json(payment);
  } catch (error) {
    next(error);
  }
});

router.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = BigInt(String(req.params.id));
      await paymentService.deletePayment(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
);

export default router;
