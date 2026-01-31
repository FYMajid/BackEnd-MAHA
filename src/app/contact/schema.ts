import { z } from "zod";

export const createContactSchema = z.object({
  organizationId: z.coerce.bigint(),
  typeId: z.coerce.bigint().optional(),
  name: z.string().min(2),
});

export const updateContactSchema = z.object({
  typeId: z.coerce.bigint().nullable().optional(),
  name: z.string().min(2).optional(),
});
