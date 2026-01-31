import { z } from "zod";

export const createDocumentSchema = z.object({
  matterId: z.coerce.bigint(),
  ownerId: z.coerce.bigint(),
  name: z.string().min(2),
});

export const updateDocumentSchema = z.object({
  name: z.string().min(2).optional(),
});
