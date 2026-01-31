import { CreateDocumentVersionDTO, UpdateDocumentVersionDTO } from "./dto";
import { prisma } from "../../lib/prisma";

export const createDocumentVersion = async (dto: CreateDocumentVersionDTO) =>
  prisma.documentVersion.create({ data: dto, include: { document: true } });

export const listDocumentVersions = async () =>
  prisma.documentVersion.findMany({ include: { document: true } });

export const getDocumentVersionById = async (id: bigint) =>
  prisma.documentVersion.findUnique({
    where: { id },
    include: { document: true },
  });

export const updateDocumentVersion = async (
  id: bigint,
  dto: UpdateDocumentVersionDTO,
) =>
  prisma.documentVersion.update({
    where: { id },
    data: dto,
    include: { document: true },
  });

export const deleteDocumentVersion = async (id: bigint) =>
  prisma.documentVersion.delete({ where: { id } });
