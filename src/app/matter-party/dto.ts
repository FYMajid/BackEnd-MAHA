export interface CreateMatterPartyDTO {
  matterId: bigint;
  contactId: bigint;
  partyRole?: string | null;
}

export interface UpdateMatterPartyDTO {
  partyRole?: string | null;
}
