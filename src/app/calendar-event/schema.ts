import { z } from "zod";

export const createCalendarEventSchema = z.object({
  matterId: z.coerce.bigint(),
  title: z.string().min(2),
  startAt: z.coerce.date(),
  endAt: z.coerce.date(),
});

export const updateCalendarEventSchema = z.object({
  title: z.string().min(2).optional(),
  startAt: z.coerce.date().optional(),
  endAt: z.coerce.date().optional(),
});
