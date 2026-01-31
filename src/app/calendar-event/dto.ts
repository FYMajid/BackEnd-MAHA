export interface CreateCalendarEventDTO {
  matterId: bigint;
  title: string;
  startAt: Date;
  endAt: Date;
}

export interface UpdateCalendarEventDTO {
  title?: string;
  startAt?: Date;
  endAt?: Date;
}
