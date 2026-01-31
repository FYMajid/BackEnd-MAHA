import { CreateDocumentDTO, UpdateDocumentDTO } from "./dto";
import { prisma } from "../../lib/prisma";

const documentInclude = { matter: true, owner: true, versions: true };

export const createDocument = async (dto: CreateDocumentDTO) =>
  prisma.document.create({ data: dto, include: documentInclude });

export const listDocuments = async () =>
  prisma.document.findMany({ include: documentInclude });

export const getDocumentById = async (id: bigint) =>
  prisma.document.findUnique({ where: { id }, include: documentInclude });

export const updateDocument = async (id: bigint, dto: UpdateDocumentDTO) =>
  prisma.document.update({ where: { id }, data: dto, include: documentInclude });

export const deleteDocument = async (id: bigint) =>
  prisma.document.delete({ where: { id } });
