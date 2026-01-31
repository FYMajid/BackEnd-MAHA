import { z } from "zod";

export const createRoleSchema = z.object({
  name: z.string().min(2),
});

export const updateRoleSchema = z.object({
  name: z.string().min(2).optional(),
});
