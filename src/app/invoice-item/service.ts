import { CreateInvoiceItemDTO, UpdateInvoiceItemDTO } from "./dto";
import { prisma } from "../../lib/prisma";

const invoiceItemInclude = { invoice: true, timeEntry: true, expense: true };

export const createInvoiceItem = async (dto: CreateInvoiceItemDTO) =>
  prisma.invoiceItem.create({ data: dto, include: invoiceItemInclude });

export const listInvoiceItems = async () =>
  prisma.invoiceItem.findMany({ include: invoiceItemInclude });

export const getInvoiceItemById = async (id: bigint) =>
  prisma.invoiceItem.findUnique({ where: { id }, include: invoiceItemInclude });

export const updateInvoiceItem = async (id: bigint, dto: UpdateInvoiceItemDTO) =>
  prisma.invoiceItem.update({ where: { id }, data: dto, include: invoiceItemInclude });

export const deleteInvoiceItem = async (id: bigint) =>
  prisma.invoiceItem.delete({ where: { id } });
