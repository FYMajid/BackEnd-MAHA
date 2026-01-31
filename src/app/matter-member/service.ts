import { CreateMatterMemberDTO, UpdateMatterMemberDTO } from "./dto";
import { prisma } from "../../lib/prisma";

export const createMatterMember = async (dto: CreateMatterMemberDTO) =>
  prisma.matterMember.create({ data: dto, include: { matter: true, user: true } });

export const listMatterMembers = async () =>
  prisma.matterMember.findMany({ include: { matter: true, user: true } });

export const getMatterMember = async (matterId: bigint, userId: bigint) =>
  prisma.matterMember.findUnique({
    where: { matterId_userId: { matterId, userId } },
    include: { matter: true, user: true },
  });

export const updateMatterMember = async (
  matterId: bigint,
  userId: bigint,
  dto: UpdateMatterMemberDTO,
) =>
  prisma.matterMember.update({
    where: { matterId_userId: { matterId, userId } },
    data: dto,
    include: { matter: true, user: true },
  });

export const deleteMatterMember = async (matterId: bigint, userId: bigint) =>
  prisma.matterMember.delete({ where: { matterId_userId: { matterId, userId } } });
