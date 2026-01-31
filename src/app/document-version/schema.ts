import { z } from "zod";

export const createDocumentVersionSchema = z.object({
  documentId: z.coerce.bigint(),
  filePath: z.string().min(1),
  versionNo: z.coerce.number().int().min(1),
  uploadedAt: z.coerce.date().optional(),
});

export const updateDocumentVersionSchema = z.object({
  filePath: z.string().min(1).optional(),
  versionNo: z.coerce.number().int().min(1).optional(),
  uploadedAt: z.coerce.date().optional(),
});
