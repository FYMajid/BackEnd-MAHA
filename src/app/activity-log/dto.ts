export interface CreateActivityLogDTO {
  organizationId: bigint;
  userId?: bigint;
  entity: string;
  entityId: bigint;
  action: string;
  createdAt?: Date;
}

export interface UpdateActivityLogDTO {
  userId?: bigint | null;
  entity?: string;
  entityId?: bigint;
  action?: string;
  createdAt?: Date;
}
