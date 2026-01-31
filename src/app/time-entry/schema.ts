import { z } from "zod";

export const createTimeEntrySchema = z.object({
  matterId: z.coerce.bigint(),
  userId: z.coerce.bigint(),
  hours: z.coerce.number().positive(),
  rate: z.coerce.number().nonnegative(),
  billable: z.coerce.boolean().optional(),
  createdAt: z.coerce.date().optional(),
});

export const updateTimeEntrySchema = z.object({
  hours: z.coerce.number().positive().optional(),
  rate: z.coerce.number().nonnegative().optional(),
  billable: z.coerce.boolean().optional(),
  createdAt: z.coerce.date().optional(),
});
