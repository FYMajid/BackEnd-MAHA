import { z } from "zod";

export const createInvoiceSchema = z.object({
  matterId: z.coerce.bigint(),
  total: z.coerce.number().nonnegative().optional(),
  status: z.string().min(1),
  dueDate: z.coerce.date().optional(),
});

export const updateInvoiceSchema = z.object({
  total: z.coerce.number().nonnegative().optional(),
  status: z.string().min(1).optional(),
  dueDate: z.coerce.date().nullable().optional(),
});
