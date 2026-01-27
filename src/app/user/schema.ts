import { z } from "zod";

export const createUserSchema = z.object({
  organizationId: z.coerce.bigint(),
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  hourlyRate: z.number().optional(),
  roleNames: z.array(z.string()).optional(),
});

export const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  hourlyRate: z.number().optional(),
  isActive: z.boolean().optional(),
  roleNames: z.array(z.string()).optional(),
});
