export interface CreateEventDTO {
  title: string;
  categoryId: string;
  location?: string;
  startTime: string;
  endTime: string;
  description?: string;
  matterId?: string;
  notification?: string;
  attendees?: string;
  repeat?: string;
  hyperlink?: string;
  fileUrl?: string;
}

export interface UpdateEventDTO {
  title?: string;
  categoryId?: string;
  location?: string;
  startTime?: string;
  endTime?: string;
  description?: string;
  matterId?: string;
  notification?: string;
  attendees?: string;
  repeat?: string;
  hyperlink?: string;
  fileUrl?: string;
}
