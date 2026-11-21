import {
  DepositActionType,
  InvoiceStatus,
  PaymentProofStatus,
} from "@prisma/client";

export interface InvoiceListQuery {
  search?: string;
  status?: InvoiceStatus | "UNPAID" | string;
  clientId?: string;
  matterId?: string;
}

export interface InvoiceItemInput {
  description: string;
  quantity?: number | string | null;
  qty?: number | string | null;
  rate?: number | string | null;
}

export interface CreateInvoiceDTO {
  invoiceNo?: string;
  clientId: string;
  matterId: string;
  invoiceDate: string;
  dueDate: string;
  paymentTerms?: string;
  description?: string;
  notes?: string;
  taxPercent?: number | string | null;
  items: InvoiceItemInput[];
}

export interface UpdateInvoiceDTO extends Partial<CreateInvoiceDTO> {}

export interface PaymentProofListQuery {
  search?: string;
  status?: PaymentProofStatus | string;
  invoiceId?: string;
}

export interface CreatePaymentProofDTO {
  invoiceId: string;
  paymentDate: string;
  amountPaid: number | string;
  paymentMethod?: string;
  referenceNo?: string;
  notes?: string;
}

export interface UpdatePaymentProofDTO extends Partial<CreatePaymentProofDTO> {}

export interface DepositListQuery {
  search?: string;
  clientId?: string;
  matterId?: string;
}

export interface CreateDepositDTO {
  action: DepositActionType | string;
  clientId: string;
  matterId?: string | null;
  transactionDate: string;
  amount: number | string;
  paymentMethod?: string;
  referenceNo?: string;
  description?: string;
}

export interface UpdateDepositDTO {
  clientId?: string;
  matterId?: string | null;
  transactionDate?: string;
  amount?: number | string;
  paymentMethod?: string;
  referenceNo?: string;
  description?: string;
}
