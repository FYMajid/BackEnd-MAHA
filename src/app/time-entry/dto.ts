export interface CreateTimeEntryDTO {
  matterId: bigint;
  userId: bigint;
  hours: number;
  rate: number;
  billable?: boolean;
  createdAt?: Date;
}

export interface UpdateTimeEntryDTO {
  hours?: number;
  rate?: number;
  billable?: boolean;
  createdAt?: Date;
}
