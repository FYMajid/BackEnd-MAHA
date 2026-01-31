import express, { NextFunction, Request, Response } from "express";
import * as invoiceItemService from "./service";
import { createInvoiceItemSchema, updateInvoiceItemSchema } from "./schema";

const router = express.Router();

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto = createInvoiceItemSchema.parse(req.body);
    const item = await invoiceItemService.createInvoiceItem(dto);
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await invoiceItemService.listInvoiceItems();
    res.json(items);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = BigInt(String(req.params.id));
    const item = await invoiceItemService.getInvoiceItemById(id);
    res.json(item);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = BigInt(String(req.params.id));
    const dto = updateInvoiceItemSchema.parse(req.body);
    const item = await invoiceItemService.updateInvoiceItem(id, dto);
    res.json(item);
  } catch (error) {
    next(error);
  }
});

router.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = BigInt(String(req.params.id));
      await invoiceItemService.deleteInvoiceItem(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
);

export default router;
