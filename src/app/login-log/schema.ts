import { z } from "zod";

export const createLoginLogSchema = z.object({
  userId: z.coerce.bigint(),
  ipAddress: z.string().optional(),
  loginAt: z.coerce.date().optional(),
});

export const updateLoginLogSchema = z.object({
  ipAddress: z.string().optional(),
  loginAt: z.coerce.date().optional(),
});
