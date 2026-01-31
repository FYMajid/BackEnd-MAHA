export interface CreateInvoiceItemDTO {
  invoiceId: bigint;
  timeEntryId?: bigint;
  expenseId?: bigint;
  amount: number;
  description?: string | null;
}

export interface UpdateInvoiceItemDTO {
  timeEntryId?: bigint | null;
  expenseId?: bigint | null;
  amount?: number;
  description?: string | null;
}
