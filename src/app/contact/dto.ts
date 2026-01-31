export interface CreateContactDTO {
  organizationId: bigint;
  typeId?: bigint;
  name: string;
}

export interface UpdateContactDTO {
  typeId?: bigint | null;
  name?: string;
}
