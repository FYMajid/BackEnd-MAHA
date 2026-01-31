import { z } from "zod";

export const createMatterPartySchema = z.object({
  matterId: z.coerce.bigint(),
  contactId: z.coerce.bigint(),
  partyRole: z.string().nullable().optional(),
});

export const updateMatterPartySchema = z.object({
  partyRole: z.string().nullable().optional(),
});
