import { CreateContactDTO, UpdateContactDTO } from "./dto";
import { prisma } from "../../lib/prisma";

const contactInclude = { type: true, details: true };

export const createContact = async (dto: CreateContactDTO) =>
  prisma.contact.create({ data: dto, include: contactInclude });

export const listContacts = async () =>
  prisma.contact.findMany({ include: contactInclude });

export const getContactById = async (id: bigint) =>
  prisma.contact.findUnique({ where: { id }, include: contactInclude });

export const updateContact = async (id: bigint, dto: UpdateContactDTO) =>
  prisma.contact.update({ where: { id }, data: dto, include: contactInclude });

export const deleteContact = async (id: bigint) =>
  prisma.contact.delete({ where: { id } });
