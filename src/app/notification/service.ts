import { CreateNotificationDTO, UpdateNotificationDTO } from "./dto";
import { prisma } from "../../lib/prisma";

export const createNotification = async (dto: CreateNotificationDTO) =>
  prisma.notification.create({ data: dto, include: { user: true } });

export const listNotifications = async () =>
  prisma.notification.findMany({ include: { user: true } });

export const getNotificationById = async (id: bigint) =>
  prisma.notification.findUnique({
    where: { id },
    include: { user: true },
  });

export const updateNotification = async (
  id: bigint,
  dto: UpdateNotificationDTO,
) =>
  prisma.notification.update({
    where: { id },
    data: dto,
    include: { user: true },
  });

export const deleteNotification = async (id: bigint) =>
  prisma.notification.delete({ where: { id } });
