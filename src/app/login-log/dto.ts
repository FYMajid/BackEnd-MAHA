export interface CreateLoginLogDTO {
  userId: bigint;
  ipAddress?: string;
  loginAt?: Date;
}

export interface UpdateLoginLogDTO {
  ipAddress?: string;
  loginAt?: Date;
}
