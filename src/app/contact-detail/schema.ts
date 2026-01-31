import { z } from "zod";

export const createContactDetailSchema = z.object({
  contactId: z.coerce.bigint(),
  address: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  taxNumber: z.string().nullable().optional(),
});

export const updateContactDetailSchema = z.object({
  address: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  taxNumber: z.string().nullable().optional(),
});
