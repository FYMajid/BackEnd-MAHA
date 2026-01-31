import express, { NextFunction, Request, Response } from "express";
import * as contactDetailService from "./service";
import { createContactDetailSchema, updateContactDetailSchema } from "./schema";

const router = express.Router();

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto = createContactDetailSchema.parse(req.body);
    const detail = await contactDetailService.createContactDetail(dto);
    res.status(201).json(detail);
  } catch (error) {
    next(error);
  }
});

router.get(
  "/:contactId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const contactId = BigInt(String(req.params.contactId));
      const detail = await contactDetailService.getContactDetailById(contactId);
      res.json(detail);
    } catch (error) {
      next(error);
    }
  },
);

router.put(
  "/:contactId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const contactId = BigInt(String(req.params.contactId));
      const dto = updateContactDetailSchema.parse(req.body);
      const detail = await contactDetailService.updateContactDetail(contactId, dto);
      res.json(detail);
    } catch (error) {
      next(error);
    }
  },
);

router.delete(
  "/:contactId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const contactId = BigInt(String(req.params.contactId));
      await contactDetailService.deleteContactDetail(contactId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
);

export default router;
