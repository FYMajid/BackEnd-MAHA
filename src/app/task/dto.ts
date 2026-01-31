export type TaskStatus = "TODO" | "DOING" | "DONE";

export interface CreateTaskDTO {
  matterId: bigint;
  assignedTo?: bigint;
  title: string;
  description?: string | null;
  status: TaskStatus;
  dueDate?: Date;
}

export interface UpdateTaskDTO {
  assignedTo?: bigint | null;
  title?: string;
  description?: string | null;
  status?: TaskStatus;
  dueDate?: Date | null;
}
