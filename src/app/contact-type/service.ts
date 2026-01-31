import { CreateContactTypeDTO, UpdateContactTypeDTO } from "./dto";
import { prisma } from "../../lib/prisma";

export const createContactType = async (dto: CreateContactTypeDTO) =>
  prisma.contactType.create({ data: dto });

export const listContactTypes = async () => prisma.contactType.findMany();

export const getContactTypeById = async (id: bigint) =>
  prisma.contactType.findUnique({ where: { id } });

export const updateContactType = async (
  id: bigint,
  dto: UpdateContactTypeDTO,
) => prisma.contactType.update({ where: { id }, data: dto });

export const deleteContactType = async (id: bigint) =>
  prisma.contactType.delete({ where: { id } });
