import { CreateActivityLogDTO, UpdateActivityLogDTO } from "./dto";
import { prisma } from "../../lib/prisma";

const activityInclude = { organization: true, user: true };

export const createActivityLog = async (dto: CreateActivityLogDTO) =>
  prisma.activityLog.create({ data: dto, include: activityInclude });

export const listActivityLogs = async () =>
  prisma.activityLog.findMany({ include: activityInclude });

export const getActivityLogById = async (id: bigint) =>
  prisma.activityLog.findUnique({ where: { id }, include: activityInclude });

export const updateActivityLog = async (
  id: bigint,
  dto: UpdateActivityLogDTO,
) =>
  prisma.activityLog.update({ where: { id }, data: dto, include: activityInclude });

export const deleteActivityLog = async (id: bigint) =>
  prisma.activityLog.delete({ where: { id } });
