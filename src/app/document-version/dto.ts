export interface CreateDocumentVersionDTO {
  documentId: bigint;
  filePath: string;
  versionNo: number;
  uploadedAt?: Date;
}

export interface UpdateDocumentVersionDTO {
  filePath?: string;
  versionNo?: number;
  uploadedAt?: Date;
}
