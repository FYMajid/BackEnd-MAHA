import { CreateTimeEntryDTO, UpdateTimeEntryDTO } from "./dto";
import { prisma } from "../../lib/prisma";

export const createTimeEntry = async (dto: CreateTimeEntryDTO) =>
  prisma.timeEntry.create({
    data: dto,
    include: { matter: true, user: true, invoiceItems: true },
  });

export const listTimeEntries = async () =>
  prisma.timeEntry.findMany({
    include: { matter: true, user: true, invoiceItems: true },
  });

export const getTimeEntryById = async (id: bigint) =>
  prisma.timeEntry.findUnique({
    where: { id },
    include: { matter: true, user: true, invoiceItems: true },
  });

export const updateTimeEntry = async (id: bigint, dto: UpdateTimeEntryDTO) =>
  prisma.timeEntry.update({
    where: { id },
    data: dto,
    include: { matter: true, user: true, invoiceItems: true },
  });

export const deleteTimeEntry = async (id: bigint) =>
  prisma.timeEntry.delete({ where: { id } });
