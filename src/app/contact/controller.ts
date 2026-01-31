import express, { NextFunction, Request, Response } from "express";
import * as contactService from "./service";
import { createContactSchema, updateContactSchema } from "./schema";

const router = express.Router();

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto = createContactSchema.parse(req.body);
    const contact = await contactService.createContact(dto);
    res.status(201).json(contact);
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const contacts = await contactService.listContacts();
    res.json(contacts);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = BigInt(String(req.params.id));
    const contact = await contactService.getContactById(id);
    res.json(contact);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = BigInt(String(req.params.id));
    const dto = updateContactSchema.parse(req.body);
    const contact = await contactService.updateContact(id, dto);
    res.json(contact);
  } catch (error) {
    next(error);
  }
});

router.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = BigInt(String(req.params.id));
      await contactService.deleteContact(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
);

export default router;
