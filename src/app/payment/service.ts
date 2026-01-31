import { CreatePaymentDTO, UpdatePaymentDTO } from "./dto";
import { prisma } from "../../lib/prisma";

export const createPayment = async (dto: CreatePaymentDTO) =>
  prisma.payment.create({ data: dto, include: { invoice: true } });

export const listPayments = async () =>
  prisma.payment.findMany({ include: { invoice: true } });

export const getPaymentById = async (id: bigint) =>
  prisma.payment.findUnique({ where: { id }, include: { invoice: true } });

export const updatePayment = async (id: bigint, dto: UpdatePaymentDTO) =>
  prisma.payment.update({ where: { id }, data: dto, include: { invoice: true } });

export const deletePayment = async (id: bigint) =>
  prisma.payment.delete({ where: { id } });
