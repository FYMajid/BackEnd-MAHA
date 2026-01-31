import { z } from "zod";

export const createExpenseSchema = z.object({
  matterId: z.coerce.bigint(),
  description: z.string().min(2),
  amount: z.coerce.number().nonnegative(),
  createdAt: z.coerce.date().optional(),
});

export const updateExpenseSchema = z.object({
  description: z.string().min(2).optional(),
  amount: z.coerce.number().nonnegative().optional(),
  createdAt: z.coerce.date().optional(),
});
