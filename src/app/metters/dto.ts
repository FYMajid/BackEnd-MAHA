export interface CreateMatterDTO {
  clientId: string;
  responsibleAttorneyId: string;
  members?: string;
  caseArea: string;
  caseType: string;
  disputeResolution: string;
  description?: string;
  address?: string;
  status: "DONE" | "IN_PROGRESS" | "PENDING";
  startDate?: string;
  pendingDate?: string;
  closeDate?: string;
  paymentMethod?: string;
  additionalInfo?: string;
  relatedContacts?: MatterRelatedContactInput[];
}

export interface MatterRelatedContactInput {
  contactId: string;
  description?: string;
}

export interface UpdateMatterDTO extends Partial<CreateMatterDTO> {}
