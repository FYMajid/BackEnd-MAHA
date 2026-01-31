import { z } from "zod";

export const createPermissionSchema = z.object({
  code: z.string().min(2),
});

export const updatePermissionSchema = z.object({
  code: z.string().min(2).optional(),
});
