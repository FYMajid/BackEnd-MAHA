import { CreateCalendarEventDTO, UpdateCalendarEventDTO } from "./dto";
import { prisma } from "../../lib/prisma";

export const createCalendarEvent = async (dto: CreateCalendarEventDTO) =>
  prisma.calendarEvent.create({ data: dto, include: { matter: true } });

export const listCalendarEvents = async () =>
  prisma.calendarEvent.findMany({ include: { matter: true } });

export const getCalendarEventById = async (id: bigint) =>
  prisma.calendarEvent.findUnique({ where: { id }, include: { matter: true } });

export const updateCalendarEvent = async (
  id: bigint,
  dto: UpdateCalendarEventDTO,
) =>
  prisma.calendarEvent.update({
    where: { id },
    data: dto,
    include: { matter: true },
  });

export const deleteCalendarEvent = async (id: bigint) =>
  prisma.calendarEvent.delete({ where: { id } });
