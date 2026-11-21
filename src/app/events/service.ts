import { prisma } from "../../lib/prisma";
import { CreateEventDTO, UpdateEventDTO } from "./dto";

export const getAllEvents = async () => {
  return await prisma.event.findMany({
    include: {
      category: true,
      matter: {
        select: {
          id: true,
          caseArea: true,
        },
      },
    },
    orderBy: {
      startTime: "asc",
    },
  });
};

export const createEvent = async (data: CreateEventDTO) => {
  return await prisma.event.create({
    data: {
      title: data.title,
      categoryId: data.categoryId,
      location: data.location,
      startTime: new Date(data.startTime),
      endTime: new Date(data.endTime),
      description: data.description,
      matterId: data.matterId,
      notification: data.notification,
      attendees: data.attendees,
      repeat: data.repeat,
      hyperlink: data.hyperlink,
      fileUrl: data.fileUrl,
    },
    include: {
      category: true,
      matter: true,
    },
  });
};

export const getEventById = async (id: string) => {
  return await prisma.event.findUnique({
    where: { id },
    include: {
      category: true, // Mengambil data nama & warna kategori
      matter: {
        // Mengambil data kasus terkait
        select: {
          id: true,
          caseArea: true,
          client: {
            select: { name: true },
          },
        },
      },
    },
  });
};

export const getEventsByMonth = async (month: number, year: number) => {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  return await prisma.event.findMany({
    where: {
      startTime: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: { category: true },
  });
};

export const updateEvent = async (id: string, data: UpdateEventDTO) => {
  return await prisma.event.update({
    where: { id },
    data: {
      ...data,
      // Pastikan format tanggal dikonversi jika ada perubahan waktu
      startTime: data.startTime ? new Date(data.startTime) : undefined,
      endTime: data.endTime ? new Date(data.endTime) : undefined,
    },
    include: {
      category: true,
      matter: true,
    },
  });
};

export const deleteEvent = async (id: string) => {
  return await prisma.event.delete({
    where: {
      id: id,
    },
  });
};

export const getCategories = async () => {
  return await prisma.eventCategory.findMany();
};
