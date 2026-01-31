import { z } from "zod";

export const createBankAccountSchema = z.object({
  organizationId: z.coerce.bigint(),
  bankName: z.string().min(1),
  accountNumber: z.string().min(1),
});

export const updateBankAccountSchema = z.object({
  bankName: z.string().min(1).optional(),
  accountNumber: z.string().min(1).optional(),
});
