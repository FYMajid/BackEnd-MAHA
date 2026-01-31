import { CreateMatterDTO, UpdateMatterDTO } from "./dto";
import { prisma } from "../../lib/prisma";

const matterInclude = {
  client: true,
  members: { include: { user: true } },
  parties: { include: { contact: true } },
};

export const createMatter = async (dto: CreateMatterDTO) =>
  prisma.matter.create({ data: dto, include: matterInclude });

export const listMatters = async () =>
  prisma.matter.findMany({ include: matterInclude });

export const getMatterById = async (id: bigint) =>
  prisma.matter.findUnique({ where: { id }, include: matterInclude });

export const updateMatter = async (id: bigint, dto: UpdateMatterDTO) =>
  prisma.matter.update({ where: { id }, data: dto, include: matterInclude });

export const deleteMatter = async (id: bigint) =>
  prisma.matter.delete({ where: { id } });
