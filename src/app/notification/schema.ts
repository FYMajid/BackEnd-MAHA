import { z } from "zod";

export const createNotificationSchema = z.object({
  userId: z.coerce.bigint(),
  message: z.string().min(1),
  readAt: z.coerce.date().optional(),
});

export const updateNotificationSchema = z.object({
  message: z.string().min(1).optional(),
  readAt: z.coerce.date().nullable().optional(),
});
