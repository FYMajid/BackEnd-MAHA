import { CreateExpenseDTO, UpdateExpenseDTO } from "./dto";
import { prisma } from "../../lib/prisma";

export const createExpense = async (dto: CreateExpenseDTO) =>
  prisma.expense.create({
    data: dto,
    include: { matter: true, invoiceItems: true },
  });

export const listExpenses = async () =>
  prisma.expense.findMany({ include: { matter: true, invoiceItems: true } });

export const getExpenseById = async (id: bigint) =>
  prisma.expense.findUnique({
    where: { id },
    include: { matter: true, invoiceItems: true },
  });

export const updateExpense = async (id: bigint, dto: UpdateExpenseDTO) =>
  prisma.expense.update({
    where: { id },
    data: dto,
    include: { matter: true, invoiceItems: true },
  });

export const deleteExpense = async (id: bigint) =>
  prisma.expense.delete({ where: { id } });
