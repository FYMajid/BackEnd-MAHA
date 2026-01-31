export interface CreateDocumentDTO {
  matterId: bigint;
  ownerId: bigint;
  name: string;
}

export interface UpdateDocumentDTO {
  name?: string;
}
