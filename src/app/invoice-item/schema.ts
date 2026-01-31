import { z } from "zod";

export const createInvoiceItemSchema = z.object({
  invoiceId: z.coerce.bigint(),
  timeEntryId: z.coerce.bigint().optional(),
  expenseId: z.coerce.bigint().optional(),
  amount: z.coerce.number().nonnegative(),
  description: z.string().nullable().optional(),
});

export const updateInvoiceItemSchema = z.object({
  timeEntryId: z.coerce.bigint().nullable().optional(),
  expenseId: z.coerce.bigint().nullable().optional(),
  amount: z.coerce.number().nonnegative().optional(),
  description: z.string().nullable().optional(),
});
