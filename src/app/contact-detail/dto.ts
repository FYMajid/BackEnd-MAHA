export interface CreateContactDetailDTO {
  contactId: bigint;
  address?: string | null;
  phone?: string | null;
  taxNumber?: string | null;
}

export interface UpdateContactDetailDTO {
  address?: string | null;
  phone?: string | null;
  taxNumber?: string | null;
}
