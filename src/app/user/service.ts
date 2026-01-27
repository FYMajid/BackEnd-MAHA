import { CreateUserDTO, UpdateUserDTO } from "./dto";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";

export const createUser = async (dto: CreateUserDTO) => {
  const passwordHash = await bcrypt.hash(dto.password, 10);

  const user = await prisma.user.create({
    data: {
      organizationId: dto.organizationId,
      name: dto.name,
      email: dto.email,
      passwordHash,
      hourlyRate: dto.hourlyRate ?? 0,
    },
  });

  if (dto.roleNames?.length) {
    const roles = await prisma.role.findMany({
      where: { name: { in: dto.roleNames } },
    });

    await prisma.userRole.createMany({
      data: roles.map((r) => ({
        userId: user.id,
        roleId: r.id,
      })),
    });
  }

  return user;
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error("User not found");
  }
  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }
  return user;
};

export const getUsersByOrg = async (organizationId: bigint) =>
  prisma.user.findMany({
    where: { organizationId },
    include: { roles: { include: { role: true } } },
  });

export const getUserById = async (id: bigint) =>
  prisma.user.findUnique({
    where: { id },
    include: { roles: { include: { role: true } } },
  });

export const updateUser = async (id: bigint, dto: UpdateUserDTO) => {
  const data: any = { ...dto };

  if (dto.password) {
    data.passwordHash = await bcrypt.hash(dto.password, 10);
    delete data.password;
  }

  const user = await prisma.user.update({
    where: { id },
    data,
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

  return user;
};

export const deleteUser = async (id: bigint) =>
  prisma.user.delete({ where: { id } });
