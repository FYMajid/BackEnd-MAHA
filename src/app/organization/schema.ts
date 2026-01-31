import { z } from "zod";

export const createOrganizationSchema = z.object({
  name: z.string().min(2),
  plan: z.string().optional(),
});

export const updateOrganizationSchema = z.object({
  name: z.string().min(2).optional(),
  plan: z.string().optional(),
});
