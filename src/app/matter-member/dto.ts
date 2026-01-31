export interface CreateMatterMemberDTO {
  matterId: bigint;
  userId: bigint;
  role?: string | null;
}

export interface UpdateMatterMemberDTO {
  role?: string | null;
}
