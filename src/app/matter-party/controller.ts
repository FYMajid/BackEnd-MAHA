import express, { NextFunction, Request, Response } from "express";
import * as matterPartyService from "./service";
import { createMatterPartySchema, updateMatterPartySchema } from "./schema";

const router = express.Router();

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto = createMatterPartySchema.parse(req.body);
    const party = await matterPartyService.createMatterParty(dto);
    res.status(201).json(party);
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parties = await matterPartyService.listMatterParties();
    res.json(parties);
  } catch (error) {
    next(error);
  }
});

router.get(
  "/:matterId/:contactId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const matterId = BigInt(String(req.params.matterId));
      const contactId = BigInt(String(req.params.contactId));
      const party = await matterPartyService.getMatterParty(matterId, contactId);
      res.json(party);
    } catch (error) {
      next(error);
    }
  },
);

router.put(
  "/:matterId/:contactId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const matterId = BigInt(String(req.params.matterId));
      const contactId = BigInt(String(req.params.contactId));
      const dto = updateMatterPartySchema.parse(req.body);
      const party = await matterPartyService.updateMatterParty(
        matterId,
        contactId,
        dto,
      );
      res.json(party);
    } catch (error) {
      next(error);
    }
  },
);

router.delete(
  "/:matterId/:contactId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const matterId = BigInt(String(req.params.matterId));
      const contactId = BigInt(String(req.params.contactId));
      await matterPartyService.deleteMatterParty(matterId, contactId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
);

export default router;
