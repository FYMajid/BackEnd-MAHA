import { CreateRolePermissionDTO } from "./dto";
import { prisma } from "../../lib/prisma";

export const createRolePermission = async (dto: CreateRolePermissionDTO) =>
  prisma.rolePermission.create({ data: dto });

export const listRolePermissions = async () =>
  prisma.rolePermission.findMany({ include: { role: true, permission: true } });

export const getRolePermission = async (roleId: bigint, permissionId: bigint) =>
  prisma.rolePermission.findUnique({
    where: { roleId_permissionId: { roleId, permissionId } },
    include: { role: true, permission: true },
  });

export const deleteRolePermission = async (
  roleId: bigint,
  permissionId: bigint,
) =>
  prisma.rolePermission.delete({
    where: { roleId_permissionId: { roleId, permissionId } },
  });
