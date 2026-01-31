export interface CreateBankAccountDTO {
  organizationId: bigint;
  bankName: string;
  accountNumber: string;
}

export interface UpdateBankAccountDTO {
  bankName?: string;
  accountNumber?: string;
}
