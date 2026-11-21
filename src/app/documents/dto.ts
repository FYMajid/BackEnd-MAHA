export interface CreateDocumentDto {
  type: "FILE" | "FOLDER";
  name: string;
  parentId?: string | null;
  contactId?: string; // Opsional, bisa diisi id dari Contact
  matterId?: string;
  physicalLocation?: string;
  hyperlink?: string;
  description?: string;
  fileSize?: number;
}

export interface UpdateDocumentDto {
  name?: string;
  parentId?: string | null;
  physicalLocation?: string;
  hyperlink?: string;
  description?: string;
  contactId?: string;
  matterId?: string;
}
