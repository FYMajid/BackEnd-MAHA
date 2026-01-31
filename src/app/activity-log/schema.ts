import { z } from "zod";

export const createActivityLogSchema = z.object({
  organizationId: z.coerce.bigint(),
  userId: z.coerce.bigint().optional(),
  entity: z.string().min(1),
  entityId: z.coerce.bigint(),
  action: z.string().min(1),
  createdAt: z.coerce.date().optional(),
});

export const updateActivityLogSchema = z.object({
  userId: z.coerce.bigint().nullable().optional(),
  entity: z.string().min(1).optional(),
  entityId: z.coerce.bigint().optional(),
  action: z.string().min(1).optional(),
  createdAt: z.coerce.date().optional(),
});
