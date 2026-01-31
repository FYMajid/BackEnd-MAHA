import express, { NextFunction, Request, Response } from "express";
import * as documentService from "./service";
import { createDocumentSchema, updateDocumentSchema } from "./schema";

const router = express.Router();

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto = createDocumentSchema.parse(req.body);
    const document = await documentService.createDocument(dto);
    res.status(201).json(document);
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const documents = await documentService.listDocuments();
    res.json(documents);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = BigInt(String(req.params.id));
    const document = await documentService.getDocumentById(id);
    res.json(document);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = BigInt(String(req.params.id));
    const dto = updateDocumentSchema.parse(req.body);
    const document = await documentService.updateDocument(id, dto);
    res.json(document);
  } catch (error) {
    next(error);
  }
});

router.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = BigInt(String(req.params.id));
      await documentService.deleteDocument(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
);

export default router;
