import { CreateInvoiceDTO, UpdateInvoiceDTO } from "./dto";
import { prisma } from "../../lib/prisma";

const invoiceInclude = { matter: true, items: true, payments: true };

export const createInvoice = async (dto: CreateInvoiceDTO) =>
  prisma.invoice.create({ data: dto, include: invoiceInclude });

export const listInvoices = async () =>
  prisma.invoice.findMany({ include: invoiceInclude });

export const getInvoiceById = async (id: bigint) =>
  prisma.invoice.findUnique({ where: { id }, include: invoiceInclude });

export const updateInvoice = async (id: bigint, dto: UpdateInvoiceDTO) =>
  prisma.invoice.update({ where: { id }, data: dto, include: invoiceInclude });

export const deleteInvoice = async (id: bigint) =>
  prisma.invoice.delete({ where: { id } });
