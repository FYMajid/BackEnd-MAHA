import express, { NextFunction, Request, Response } from "express";
import * as documentService from "./service";
import { CreateDocumentDto, UpdateDocumentDto } from "./dto";
import { uploadDocumentFile } from "../../middleware/upload";

const router = express.Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const trash = req.query.trash === "true";
    if (trash) {
      const data = await documentService.getTrashDocuments();
      return res.status(200).json({
        status: "success",
        data,
      });
    }

    const all = req.query.all === "true";
    if (all) {
      const data = await documentService.getAllDocuments();
      return res.status(200).json({
        status: "success",
        data,
      });
    }

    const parseQueryValue = (value: unknown) => {
      if (Array.isArray(value)) {
        return value[0];
      }

      return value;
    };

    const parseQueryId = (value: unknown) => {
      const raw = parseQueryValue(value);
      if (raw === undefined || raw === null) {
        return null;
      }

      const text = String(raw).trim();
      if (!text || text === "null") {
        return null;
      }

      return text;
    };

    const parentId = parseQueryId(req.query.parentId);
    const contactId = parseQueryId(req.query.contactId) ?? undefined;
    const matterId = parseQueryId(req.query.matterId) ?? undefined;

    const data = await documentService.getDocumentsByParent(parentId, {
      contactId,
      matterId,
    });
    res.status(200).json({
      status: "success",
      data,
    });
  } catch (error) {
    next(error);
  }
});

router.get(
  "/:id/breadcrumb",
  async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const data = await documentService.getBreadcrumbById(req.params.id);
      res.status(200).json({
        status: "success",
        data,
      });
    } catch (error) {
      next(error);
    }
  },
);

router.get(
  "/:id",
  async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const contact = await documentService.getDocumentById(req.params.id);

      if (!contact) {
        return res.status(404).json({ message: "documents tidak ditemukan" });
      }

      res.status(200).json(contact);
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  "/",
  uploadDocumentFile.single("file"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload: CreateDocumentDto = req.body;
      const fileUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
      const fileSize = req.file ? req.file.size : undefined;

      const newDocument = await documentService.createDocument(
        payload,
        fileUrl,
        fileSize,
      );
      res.status(201).json({
        status: "success",
        message: "Document created successfully",
        data: newDocument,
      });
    } catch (error) {
      next(error);
    }
  },
);

router.put(
  "/:id",
  async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const payload: UpdateDocumentDto = req.body;

      const updated = await documentService.updateDocument(id, payload);
      res.status(200).json({
        status: "success",
        message: "Document updated successfully",
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  },
);

router.delete(
  "/:id",
  async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await documentService.softDeleteDocument(id);
      res.status(200).json({
        status: "success",
        message: "Document moved to trash",
      });
    } catch (error) {
      next(error);
    }
  },
);

export default router;
