import express, { NextFunction, Request, Response } from "express";
import * as matterMemberService from "./service";
import { createMatterMemberSchema, updateMatterMemberSchema } from "./schema";

const router = express.Router();

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto = createMatterMemberSchema.parse(req.body);
    const member = await matterMemberService.createMatterMember(dto);
    res.status(201).json(member);
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const members = await matterMemberService.listMatterMembers();
    res.json(members);
  } catch (error) {
    next(error);
  }
});

router.get(
  "/:matterId/:userId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const matterId = BigInt(String(req.params.matterId));
      const userId = BigInt(String(req.params.userId));
      const member = await matterMemberService.getMatterMember(matterId, userId);
      res.json(member);
    } catch (error) {
      next(error);
    }
  },
);

router.put(
  "/:matterId/:userId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const matterId = BigInt(String(req.params.matterId));
      const userId = BigInt(String(req.params.userId));
      const dto = updateMatterMemberSchema.parse(req.body);
      const member = await matterMemberService.updateMatterMember(
        matterId,
        userId,
        dto,
      );
      res.json(member);
    } catch (error) {
      next(error);
    }
  },
);

router.delete(
  "/:matterId/:userId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const matterId = BigInt(String(req.params.matterId));
      const userId = BigInt(String(req.params.userId));
      await matterMemberService.deleteMatterMember(matterId, userId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
);

export default router;
