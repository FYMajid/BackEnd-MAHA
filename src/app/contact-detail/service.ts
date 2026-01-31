import { CreateContactDetailDTO, UpdateContactDetailDTO } from "./dto";
import { prisma } from "../../lib/prisma";

export const createContactDetail = async (dto: CreateContactDetailDTO) =>
  prisma.contactDetail.create({ data: dto, include: { contact: true } });

export const getContactDetailById = async (contactId: bigint) =>
  prisma.contactDetail.findUnique({
    where: { contactId },
    include: { contact: true },
  });

export const updateContactDetail = async (
  contactId: bigint,
  dto: UpdateContactDetailDTO,
) =>
  prisma.contactDetail.update({
    where: { contactId },
    data: dto,
    include: { contact: true },
  });

export const deleteContactDetail = async (contactId: bigint) =>
  prisma.contactDetail.delete({ where: { contactId } });
