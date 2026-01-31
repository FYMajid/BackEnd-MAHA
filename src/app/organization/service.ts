import { CreateOrganizationDTO, UpdateOrganizationDTO } from "./dto";
import { prisma } from "../../lib/prisma";

export const createOrganization = async (dto: CreateOrganizationDTO) =>
  prisma.organization.create({ data: dto });

export const listOrganizations = async () => prisma.organization.findMany();

export const getOrganizationById = async (id: bigint) =>
  prisma.organization.findUnique({ where: { id } });

export const updateOrganization = async (
  id: bigint,
  dto: UpdateOrganizationDTO,
) => prisma.organization.update({ where: { id }, data: dto });

export const deleteOrganization = async (id: bigint) =>
  prisma.organization.delete({ where: { id } });
