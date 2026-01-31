import express, { NextFunction, Request, Response } from "express";
import * as bankAccountService from "./service";
import { createBankAccountSchema, updateBankAccountSchema } from "./schema";

const router = express.Router();

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto = createBankAccountSchema.parse(req.body);
    const account = await bankAccountService.createBankAccount(dto);
    res.status(201).json(account);
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accounts = await bankAccountService.listBankAccounts();
    res.json(accounts);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = BigInt(String(req.params.id));
    const account = await bankAccountService.getBankAccountById(id);
    res.json(account);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = BigInt(String(req.params.id));
    const dto = updateBankAccountSchema.parse(req.body);
    const account = await bankAccountService.updateBankAccount(id, dto);
    res.json(account);
  } catch (error) {
    next(error);
  }
});

router.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = BigInt(String(req.params.id));
      await bankAccountService.deleteBankAccount(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
);

export default router;
