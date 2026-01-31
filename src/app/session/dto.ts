export interface CreateSessionDTO {
  userId: bigint;
  token: string;
  expiredAt?: Date;
}

export interface UpdateSessionDTO {
  token?: string;
  expiredAt?: Date;
}
