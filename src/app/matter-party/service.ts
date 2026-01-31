import { CreateMatterPartyDTO, UpdateMatterPartyDTO } from "./dto";
import { prisma } from "../../lib/prisma";

export const createMatterParty = async (dto: CreateMatterPartyDTO) =>
  prisma.matterParty.create({ data: dto, include: { matter: true, contact: true } });

export const listMatterParties = async () =>
  prisma.matterParty.findMany({ include: { matter: true, contact: true } });

export const getMatterParty = async (matterId: bigint, contactId: bigint) =>
  prisma.matterParty.findUnique({
    where: { matterId_contactId: { matterId, contactId } },
    include: { matter: true, contact: true },
  });

export const updateMatterParty = async (
  matterId: bigint,
  contactId: bigint,
  dto: UpdateMatterPartyDTO,
) =>
  prisma.matterParty.update({
    where: { matterId_contactId: { matterId, contactId } },
    data: dto,
    include: { matter: true, contact: true },
  });

export const deleteMatterParty = async (matterId: bigint, contactId: bigint) =>
  prisma.matterParty.delete({ where: { matterId_contactId: { matterId, contactId } } });
