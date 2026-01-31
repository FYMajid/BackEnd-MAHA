import { CreateLoginLogDTO, UpdateLoginLogDTO } from "./dto";
import { prisma } from "../../lib/prisma";

export const createLoginLog = async (dto: CreateLoginLogDTO) =>
  prisma.loginLog.create({ data: dto });

export const listLoginLogs = async () =>
  prisma.loginLog.findMany({ include: { user: true } });

export const getLoginLogById = async (id: bigint) =>
  prisma.loginLog.findUnique({ where: { id }, include: { user: true } });

export const updateLoginLog = async (id: bigint, dto: UpdateLoginLogDTO) =>
  prisma.loginLog.update({ where: { id }, data: dto });

export const deleteLoginLog = async (id: bigint) =>
  prisma.loginLog.delete({ where: { id } });
