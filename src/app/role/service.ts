import { CreateRoleDTO, UpdateRoleDTO } from "./dto";
import { prisma } from "../../lib/prisma";

export const createRole = async (dto: CreateRoleDTO) =>
  prisma.role.create({ data: dto });

export const listRoles = async () => prisma.role.findMany();

export const getRoleById = async (id: bigint) =>
  prisma.role.findUnique({ where: { id } });

export const updateRole = async (id: bigint, dto: UpdateRoleDTO) =>
  prisma.role.update({ where: { id }, data: dto });

export const deleteRole = async (id: bigint) =>
  prisma.role.delete({ where: { id } });
