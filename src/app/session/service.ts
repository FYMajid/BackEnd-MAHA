import { CreateSessionDTO, UpdateSessionDTO } from "./dto";
import { prisma } from "../../lib/prisma";

const sessionSelect = {
  id: true,
  userId: true,
  expiredAt: true,
  user: true,
};

export const createSession = async (dto: CreateSessionDTO) =>
  prisma.session.create({ data: dto, select: sessionSelect });

export const listSessions = async () =>
  prisma.session.findMany({ select: sessionSelect });

export const getSessionById = async (id: bigint) =>
  prisma.session.findUnique({ where: { id }, select: sessionSelect });

export const updateSession = async (id: bigint, dto: UpdateSessionDTO) =>
  prisma.session.update({ where: { id }, data: dto, select: sessionSelect });

export const deleteSession = async (id: bigint) =>
  prisma.session.delete({ where: { id } });
