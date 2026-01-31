import { CreateTaskDTO, UpdateTaskDTO } from "./dto";
import { prisma } from "../../lib/prisma";

export const createTask = async (dto: CreateTaskDTO) =>
  prisma.task.create({ data: dto, include: { matter: true, user: true } });

export const listTasks = async () =>
  prisma.task.findMany({ include: { matter: true, user: true } });

export const getTaskById = async (id: bigint) =>
  prisma.task.findUnique({ where: { id }, include: { matter: true, user: true } });

export const updateTask = async (id: bigint, dto: UpdateTaskDTO) =>
  prisma.task.update({ where: { id }, data: dto, include: { matter: true, user: true } });

export const deleteTask = async (id: bigint) =>
  prisma.task.delete({ where: { id } });
