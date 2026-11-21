import {
  CostJournalBillingType,
  CostJournalEntryType,
} from "@prisma/client";

export interface CostJournalListQuery {
  search?: string;
  type?: CostJournalEntryType | string;
  billingType?: CostJournalBillingType | string;
  matterId?: string;
}

export interface CreateCostJournalDTO {
  matterId: string;
  entryType: CostJournalEntryType | string;
  billingType?: CostJournalBillingType | string;
  category?: string;
  entryDate: string;
  description?: string;
  quantity?: number | string | null;
  unitCost?: number | string | null;
  durationMinutes?: number | string | null;
  hourlyRate?: number | string | null;
  attachmentUrl?: string;
  createdBy?: string;
}

export interface UpdateCostJournalDTO extends Partial<CreateCostJournalDTO> {}
