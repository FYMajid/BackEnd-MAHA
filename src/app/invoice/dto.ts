export interface CreateInvoiceDTO {
  matterId: bigint;
  total?: number;
  status: string;
  dueDate?: Date;
}

export interface UpdateInvoiceDTO {
  total?: number;
  status?: string;
  dueDate?: Date | null;
}
