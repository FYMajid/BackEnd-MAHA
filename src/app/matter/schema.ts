import { z } from "zod";

const matterTypeEnum = z.enum(["LITIGATION", "NON_LITIGATION"]);
const matterStatusEnum = z.enum(["OPEN", "IN_PROGRESS", "CLOSED", "ARCHIVED"]);
const billingTypeEnum = z.enum(["HOURLY", "FIXED", "RETAINER"]);

export const createMatterSchema = z.object({
  organizationId: z.coerce.bigint(),
  clientId: z.coerce.bigint().optional(),
  title: z.string().min(2),
  type: matterTypeEnum,
  status: matterStatusEnum,
  billingType: billingTypeEnum,
});

export const updateMatterSchema = z.object({
  clientId: z.coerce.bigint().nullable().optional(),
  title: z.string().min(2).optional(),
  type: matterTypeEnum.optional(),
  status: matterStatusEnum.optional(),
  billingType: billingTypeEnum.optional(),
});
