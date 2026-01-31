export interface CreateExpenseDTO {
  matterId: bigint;
  description: string;
  amount: number;
  createdAt?: Date;
}

export interface UpdateExpenseDTO {
  description?: string;
  amount?: number;
  createdAt?: Date;
}
