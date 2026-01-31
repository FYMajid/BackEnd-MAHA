import { z } from "zod";

export const createRolePermissionSchema = z.object({
  roleId: z.coerce.bigint(),
  permissionId: z.coerce.bigint(),
});
