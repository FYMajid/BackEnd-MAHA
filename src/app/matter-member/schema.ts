import { z } from "zod";

export const createMatterMemberSchema = z.object({
  matterId: z.coerce.bigint(),
  userId: z.coerce.bigint(),
  role: z.string().nullable().optional(),
});

export const updateMatterMemberSchema = z.object({
  role: z.string().nullable().optional(),
});
