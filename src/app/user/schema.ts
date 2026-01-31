import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8)
  .regex(/[a-z]/, "Password must include a lowercase letter")
  .regex(/[A-Z]/, "Password must include an uppercase letter")
  .regex(/[0-9]/, "Password must include a number")
  .regex(/[^A-Za-z0-9]/, "Password must include a symbol");

export const createUserSchema = z.object({
  organizationId: z.coerce.bigint(),
  name: z.string().min(2),
  email: z.string().email(),
  password: passwordSchema,
  hourlyRate: z.number().optional(),
  roleNames: z.array(z.string()).optional(),
});

export const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  password: passwordSchema.optional(),
  hourlyRate: z.number().optional(),
  isActive: z.boolean().optional(),
  roleNames: z.array(z.string()).optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
