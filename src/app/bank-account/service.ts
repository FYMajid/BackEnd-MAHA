import { CreateBankAccountDTO, UpdateBankAccountDTO } from "./dto";
import { prisma } from "../../lib/prisma";

export const createBankAccount = async (dto: CreateBankAccountDTO) =>
  prisma.bankAccount.create({ data: dto, include: { organization: true } });

export const listBankAccounts = async () =>
  prisma.bankAccount.findMany({ include: { organization: true } });

export const getBankAccountById = async (id: bigint) =>
  prisma.bankAccount.findUnique({
    where: { id },
    include: { organization: true },
  });

export const updateBankAccount = async (
  id: bigint,
  dto: UpdateBankAccountDTO,
) =>
  prisma.bankAccount.update({
    where: { id },
    data: dto,
    include: { organization: true },
  });

export const deleteBankAccount = async (id: bigint) =>
  prisma.bankAccount.delete({ where: { id } });
