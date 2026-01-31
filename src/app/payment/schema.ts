import { z } from "zod";

export const createPaymentSchema = z.object({
  invoiceId: z.coerce.bigint(),
  amount: z.coerce.number().nonnegative(),
  paidAt: z.coerce.date(),
});

export const updatePaymentSchema = z.object({
  amount: z.coerce.number().nonnegative().optional(),
  paidAt: z.coerce.date().optional(),
});
