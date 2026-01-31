import { z } from "zod";

export const createUserRoleSchema = z.object({
  userId: z.coerce.bigint(),
  roleId: z.coerce.bigint(),
});
