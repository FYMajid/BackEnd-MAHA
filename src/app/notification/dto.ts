export interface CreateNotificationDTO {
  userId: bigint;
  message: string;
  readAt?: Date;
}

export interface UpdateNotificationDTO {
  message?: string;
  readAt?: Date | null;
}
