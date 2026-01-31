import express, { NextFunction, Request, Response } from "express";
import * as documentVersionService from "./service";
import {
  createDocumentVersionSchema,
  updateDocumentVersionSchema,
} from "./schema";

const router = express.Router();

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto = createDocumentVersionSchema.parse(req.body);
    const version = await documentVersionService.createDocumentVersion(dto);
    res.status(201).json(version);
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const versions = await documentVersionService.listDocumentVersions();
    res.json(versions);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = BigInt(String(req.params.id));
    const version = await documentVersionService.getDocumentVersionById(id);
    res.json(version);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = BigInt(String(req.params.id));
    const dto = updateDocumentVersionSchema.parse(req.body);
    const version = await documentVersionService.updateDocumentVersion(id, dto);
    res.json(version);
  } catch (error) {
    next(error);
  }
});

router.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = BigInt(String(req.params.id));
      await documentVersionService.deleteDocumentVersion(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
);

export default router;
