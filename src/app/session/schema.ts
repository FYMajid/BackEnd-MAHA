import { z } from "zod";

export const createSessionSchema = z.object({
  userId: z.coerce.bigint(),
  token: z.string().min(1),
  expiredAt: z.coerce.date().optional(),
});

export const updateSessionSchema = z.object({
  token: z.string().min(1).optional(),
  expiredAt: z.coerce.date().optional(),
});
