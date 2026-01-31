import express, { NextFunction, Request, Response } from "express";
import * as invoiceService from "./service";
import { createInvoiceSchema, updateInvoiceSchema } from "./schema";

const router = express.Router();

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto = createInvoiceSchema.parse(req.body);
    const invoice = await invoiceService.createInvoice(dto);
    res.status(201).json(invoice);
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const invoices = await invoiceService.listInvoices();
    res.json(invoices);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = BigInt(String(req.params.id));
    const invoice = await invoiceService.getInvoiceById(id);
    res.json(invoice);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = BigInt(String(req.params.id));
    const dto = updateInvoiceSchema.parse(req.body);
    const invoice = await invoiceService.updateInvoice(id, dto);
    res.json(invoice);
  } catch (error) {
    next(error);
  }
});

router.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = BigInt(String(req.params.id));
      await invoiceService.deleteInvoice(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
);

export default router;
