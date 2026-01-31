import { z } from "zod";

export const createContactTypeSchema = z.object({
  label: z.string().min(1),
});

export const updateContactTypeSchema = z.object({
  label: z.string().min(1).optional(),
});
