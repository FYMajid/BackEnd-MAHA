import { z } from "zod";

const taskStatusEnum = z.enum(["TODO", "DOING", "DONE"]);

export const createTaskSchema = z.object({
  matterId: z.coerce.bigint(),
  assignedTo: z.coerce.bigint().optional(),
  title: z.string().min(2),
  description: z.string().nullable().optional(),
  status: taskStatusEnum,
  dueDate: z.coerce.date().optional(),
});

export const updateTaskSchema = z.object({
  assignedTo: z.coerce.bigint().nullable().optional(),
  title: z.string().min(2).optional(),
  description: z.string().nullable().optional(),
  status: taskStatusEnum.optional(),
  dueDate: z.coerce.date().nullable().optional(),
});
