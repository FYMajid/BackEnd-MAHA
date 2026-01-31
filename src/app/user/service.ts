import { CreateUserDTO, UpdateUserDTO } from "./dto";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";

const userSelect = {
  id: true,
  organizationId: true,
  name: true,
  email: true,
  hourlyRate: true,
  isActive: true,
  createdAt: true,
  roles: {
    select: {
      role: true,
    },
  },
};

export const createUser = async (dto: CreateUserDTO) => {
  const passwordHash = await bcrypt.hash(dto.password, 12);

  const created = await prisma.user.create({
    data: {
      organizationId: dto.organizationId,
      name: dto.name,
      email: dto.email,
      passwordHash,
      hourlyRate: dto.hourlyRate ?? 0,
    },
    select: {
      id: true,
    },
  });

  if (dto.roleNames?.length) {
    const roles = await prisma.role.findMany({
      where: { name: { in: dto.roleNames } },
    });

    await prisma.userRole.createMany({
      data: roles.map((r) => ({
        userId: created.id,
        roleId: r.id,
      })),
    });
  }

  return prisma.user.findUnique({
    where: { id: created.id },
    select: userSelect,
  });
};

export const listUsers = async () =>
  prisma.user.findMany({
    select: userSelect,
  });

export const getUsersByOrg = async (organizationId: bigint) =>
  prisma.user.findMany({
    where: { organizationId },
    select: userSelect,
  });

export const getUserById = async (id: bigint) =>
  prisma.user.findUnique({
    where: { id },
    select: userSelect,
  });

export const updateUser = async (id: bigint, dto: UpdateUserDTO) => {
  const data: any = { ...dto };

  if (dto.password) {
    data.passwordHash = await bcrypt.hash(dto.password, 12);
    delete data.password;
  }
  if (dto.roleNames) {
    delete data.roleNames;
  }

  const updated = await prisma.user.update({
    where: { id },
    data,
    select: { id: true },
  });

  if (dto.roleNames) {
    await prisma.userRole.deleteMany({ where: { userId: id } });

    const roles = await prisma.role.findMany({
      where: { name: { in: dto.roleNames } },
    });

    await prisma.userRole.createMany({
      data: roles.map((r) => ({
        userId: id,
        roleId: r.id,
      })),
    });
  }

  return prisma.user.findUnique({
    where: { id: updated.id },
    select: userSelect,
  });
};

export const deleteUser = async (id: bigint) =>
  prisma.user.delete({ where: { id } });
