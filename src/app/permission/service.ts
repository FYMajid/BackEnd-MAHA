import { CreatePermissionDTO, UpdatePermissionDTO } from "./dto";
import { prisma } from "../../lib/prisma";

export const createPermission = async (dto: CreatePermissionDTO) =>
  prisma.permission.create({ data: dto });

export const listPermissions = async () => prisma.permission.findMany();

export const getPermissionById = async (id: bigint) =>
  prisma.permission.findUnique({ where: { id } });

export const updatePermission = async (id: bigint, dto: UpdatePermissionDTO) =>
  prisma.permission.update({ where: { id }, data: dto });

export const deletePermission = async (id: bigint) =>
  prisma.permission.delete({ where: { id } });
