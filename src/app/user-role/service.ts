import { CreateUserRoleDTO } from "./dto";
import { prisma } from "../../lib/prisma";

export const createUserRole = async (dto: CreateUserRoleDTO) =>
  prisma.userRole.create({ data: dto });

export const listUserRoles = async () =>
  prisma.userRole.findMany({ include: { user: true, role: true } });

export const getUserRole = async (userId: bigint, roleId: bigint) =>
  prisma.userRole.findUnique({
    where: { userId_roleId: { userId, roleId } },
    include: { user: true, role: true },
  });

export const deleteUserRole = async (userId: bigint, roleId: bigint) =>
  prisma.userRole.delete({ where: { userId_roleId: { userId, roleId } } });
