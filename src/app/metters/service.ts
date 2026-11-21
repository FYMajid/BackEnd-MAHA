import { BadRequestError } from "../../error/BadRequestError";
import { prisma } from "../../lib/prisma";
import {
  CreateMatterDTO,
  MatterRelatedContactInput,
  UpdateMatterDTO,
} from "./dto";

const normalizeRelatedContacts = (
  items?: MatterRelatedContactInput[] | null,
) => {
  if (items === undefined) {
    return undefined;
  }

  if (items === null) {
    return [];
  }

  if (!Array.isArray(items)) {
    throw new BadRequestError("relatedContacts harus berupa array");
  }

  const normalized = items.map((item, index) => {
    const contactId =
      typeof item?.contactId === "string" ? item.contactId.trim() : "";

    if (!contactId) {
      throw new BadRequestError(
        `relatedContacts[${index}].contactId wajib diisi`,
      );
    }

    const description =
      typeof item?.description === "string"
        ? item.description.trim()
        : undefined;

    return {
      contactId,
      description: description || undefined,
    };
  });

  const seen = new Set<string>();
  for (const { contactId } of normalized) {
    if (seen.has(contactId)) {
      throw new BadRequestError("Contact duplikat pada relatedContacts");
    }
    seen.add(contactId);
  }

  return normalized;
};

const assertContactsExist = async (contactIds: string[]) => {
  if (contactIds.length === 0) {
    return;
  }

  const existing = await prisma.contact.findMany({
    where: { id: { in: contactIds } },
    select: { id: true },
  });

  const existingIds = new Set(existing.map((contact) => contact.id));
  const missing = contactIds.filter((id) => !existingIds.has(id));

  if (missing.length > 0) {
    throw new BadRequestError(
      `Contact tidak ditemukan: ${missing.join(", ")}`,
    );
  }
};

const normalizeDateInput = (value?: string | Date | null) => {
  if (value === undefined) {
    return undefined;
  }

  if (value === null || value === "") {
    return null;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw new BadRequestError("Format tanggal tidak valid");
  }

  return parsed;
};

export const MatterService = {
  async getAllMatters() {
    return await prisma.matter.findMany({
      include: {
        client: { select: { name: true } },
        responsibleAttorney: { select: { firstName: true, lastName: true } },
        relatedContacts: {
          include: { contact: { select: { id: true, name: true } } },
        },
      },
    });
  },

  async createMatter(data: CreateMatterDTO) {
    const { relatedContacts, startDate, pendingDate, closeDate, ...payload } =
      data;
    const normalizedRelatedContacts = normalizeRelatedContacts(relatedContacts);
    const relatedContactIds =
      normalizedRelatedContacts?.map((item) => item.contactId) ?? [];

    if (normalizedRelatedContacts) {
      await assertContactsExist(relatedContactIds);
    }

    return await prisma.matter.create({
      data: {
        ...payload,
        startDate: normalizeDateInput(startDate) ?? null,
        pendingDate: normalizeDateInput(pendingDate) ?? null,
        closeDate: normalizeDateInput(closeDate) ?? null,
        ...(normalizedRelatedContacts
          ? {
              relatedContacts: {
                create: normalizedRelatedContacts.map((item) => ({
                  contactId: item.contactId,
                  description: item.description,
                })),
              },
            }
          : {}),
      },
      include: {
        client: { select: { id: true, name: true } },
        responsibleAttorney: {
          select: { id: true, firstName: true, lastName: true },
        },
        relatedContacts: {
          include: { contact: { select: { id: true, name: true } } },
        },
      },
    });
  },

  async getMatterById(id: string) {
    return await prisma.matter.findUnique({
      where: { id },
      include: {
        client: true,
        responsibleAttorney: true,
        relatedContacts: {
          include: { contact: { select: { id: true, name: true } } },
        },
      },
    });
  },

  async updateMatter(id: string, data: UpdateMatterDTO) {
    const { relatedContacts, startDate, pendingDate, closeDate, ...payload } =
      data;
    const normalizedRelatedContacts = normalizeRelatedContacts(relatedContacts);
    const relatedContactIds =
      normalizedRelatedContacts?.map((item) => item.contactId) ?? [];

    if (normalizedRelatedContacts) {
      await assertContactsExist(relatedContactIds);
    }

    return await prisma.matter.update({
      where: { id },
      data: {
        ...payload,
        ...(startDate !== undefined
          ? { startDate: normalizeDateInput(startDate) }
          : {}),
        ...(pendingDate !== undefined
          ? { pendingDate: normalizeDateInput(pendingDate) }
          : {}),
        ...(closeDate !== undefined
          ? { closeDate: normalizeDateInput(closeDate) }
          : {}),
        ...(normalizedRelatedContacts !== undefined
          ? {
              relatedContacts: {
                deleteMany: {},
                ...(normalizedRelatedContacts.length > 0
                  ? {
                      create: normalizedRelatedContacts.map((item) => ({
                        contactId: item.contactId,
                        description: item.description,
                      })),
                    }
                  : {}),
              },
            }
          : {}),
      },
      include: {
        client: { select: { id: true, name: true } },
        responsibleAttorney: {
          select: { id: true, firstName: true, lastName: true },
        },
        relatedContacts: {
          include: { contact: { select: { id: true, name: true } } },
        },
      },
    });
  },

  async deleteMatter(id: string) {
    return await prisma.matter.delete({
      where: { id },
    });
  },
};
