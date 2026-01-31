export interface CreatePaymentDTO {
  invoiceId: bigint;
  amount: number;
  paidAt: Date;
}

export interface UpdatePaymentDTO {
  amount?: number;
  paidAt?: Date;
}
