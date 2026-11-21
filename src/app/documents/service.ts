import { prisma } from "../../lib/prisma";
import { BadRequestError } from "../../error/BadRequestError";
import { ConflictError } from "../../error/ConflictError";
import { NotFoundError } from "../../error/NotFoundError";
import { CreateDocumentDto, UpdateDocumentDto } from "./dto";

const normalizeName = (name?: string) => (name ?? "").trim();

const normalizeNullableId = (value?: string | null) => {
  if (value === undefined || value === null) {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length === 0 ? null : trimmed;
};

const normalizeOptionalId = (value?: string | null) => {
  if (value === undefined) {
    return undefined;
  }

  return normalizeNullableId(value);
};

const assertParentIsFolder = async (parentId: string) => {
  const parent = await prisma.document.findUnique({
    where: { id: parentId },
    select: {
      id: true,
      type: true,
      isDeleted: true,
      contactId: true,
      matterId: true,
    },
  });

  if (!parent || parent.isDeleted) {
    throw new NotFoundError("Folder parent tidak ditemukan");
  }

  if (parent.type !== "FOLDER") {
    throw new BadRequestError("Parent harus berupa folder");
  }

  return parent;
};

const assertContactExists = async (contactId: string) => {
  const contact = await prisma.contact.findUnique({
    where: { id: contactId },
    select: { id: true },
  });

  if (!contact) {
    throw new BadRequestError("Contact tidak ditemukan");
  }

  return contact;
};

const assertMatterExists = async (matterId: string) => {
  const matter = await prisma.matter.findUnique({
    where: { id: matterId },
    select: { id: true, clientId: true },
  });

  if (!matter) {
    throw new BadRequestError("Matter tidak ditemukan");
  }

  return matter;
};

const assertUniqueNameInParent = async (
  name: string,
  parentId: string | null,
  excludeId?: string,
) => {
  const existing = await prisma.document.findFirst({
    where: {
      name,
      parentId,
      isDeleted: false,
      ...(excludeId ? { id: { not: excludeId } } : {}),
    },
    select: { id: true },
  });

  if (existing) {
    throw new ConflictError("Nama sudah digunakan di folder ini");
  }
};

const assertNotDescendant = async (id: string, parentId: string) => {
  let currentId: string | null = parentId;

  while (currentId) {
    if (currentId === id) {
      throw new BadRequestError(
        "Folder tidak bisa dipindahkan ke dalam dirinya sendiri atau turunannya",
      );
    }

    const current: { parentId: string | null } | null =
      await prisma.document.findUnique({
      where: { id: currentId },
      select: { parentId: true },
      });

    currentId = current?.parentId ?? null;
  }
};

const collectDescendantIds = async (rootId: string) => {
  const ids: string[] = [rootId];
  let frontier: string[] = [rootId];

  while (frontier.length > 0) {
    const children = await prisma.document.findMany({
      where: { parentId: { in: frontier } },
      select: { id: true },
    });

    const childIds = children.map((child) => child.id);
    if (childIds.length === 0) {
      break;
    }

    ids.push(...childIds);
    frontier = childIds;
  }

  return ids;
};

export const getAllDocuments = async () => {
  return await prisma.document.findMany({
    where: { isDeleted: false },
    include: {
      contact: { select: { id: true, name: true } },
      matter: {
        select: {
          id: true,
          caseType: true,
          caseArea: true,
          client: { select: { id: true, name: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const getTrashDocuments = async () => {
  return await prisma.document.findMany({
    where: { isDeleted: true },
    include: {
      contact: { select: { id: true, name: true } },
      matter: {
        select: {
          id: true,
          caseType: true,
          caseArea: true,
          client: { select: { id: true, name: true } },
        },
      },
    },
    orderBy: { lastEdit: "desc" },
  });
};

export const getDocumentsByParent = async (
  parentId: string | null,
  filters?: { contactId?: string; matterId?: string },
) => {
  if (parentId) {
    await assertParentIsFolder(parentId);
  }

  const where: {
    isDeleted: boolean;
    parentId: string | null;
    contactId?: string;
    matterId?: string;
  } = {
    isDeleted: false,
    parentId,
  };

  if (filters?.contactId) {
    where.contactId = filters.contactId;
  }

  if (filters?.matterId) {
    where.matterId = filters.matterId;
  }

  return await prisma.document.findMany({
    where,
    orderBy: [{ type: "desc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      type: true,
      parentId: true,
      physicalLocation: true,
      hyperlink: true,
      description: true,
      createdAt: true,
      lastEdit: true,
      fileUrl: true,
      fileSize: true,
      isDeleted: true,
      contactId: true,
      matterId: true,
      contact: { select: { id: true, name: true } },
      matter: {
        select: {
          id: true,
          caseType: true,
          caseArea: true,
          client: { select: { id: true, name: true } },
        },
      },
    },
  });
};

export const getBreadcrumbById = async (id: string) => {
  const path: {
    id: string;
    name: string;
    type: "FILE" | "FOLDER";
    parentId: string | null;
  }[] = [];

  let currentId: string | null = id;

  while (currentId) {
    const node:
      | {
          id: string;
          name: string;
          type: "FILE" | "FOLDER";
          parentId: string | null;
          isDeleted: boolean;
        }
      | null = await prisma.document.findUnique({
      where: { id: currentId },
      select: {
        id: true,
        name: true,
        type: true,
        parentId: true,
        isDeleted: true,
      },
    });

    if (!node || node.isDeleted) {
      throw new NotFoundError("Dokumen tidak ditemukan");
    }

    path.push({
      id: node.id,
      name: node.name,
      type: node.type,
      parentId: node.parentId,
    });

    currentId = node.parentId ?? null;
  }

  return path.reverse();
};

export const createDocument = async (
  data: CreateDocumentDto,
  fileUrl?: string,
  fileSize?: number,
) => {
  const name = normalizeName(data.name);
  if (!name) {
    throw new BadRequestError("Nama dokumen tidak boleh kosong");
  }

  const parentId = normalizeNullableId(data.parentId);
  const parent = parentId ? await assertParentIsFolder(parentId) : null;

  let contactId = normalizeNullableId(data.contactId);
  let matterId = normalizeNullableId(data.matterId);

  if (parent?.matterId) {
    if (matterId && matterId !== parent.matterId) {
      throw new BadRequestError(
        "Matter dokumen harus sama dengan matter folder parent",
      );
    }

    matterId = parent.matterId;
  }

  if (parent?.contactId) {
    if (contactId && contactId !== parent.contactId) {
      throw new BadRequestError(
        "Contact dokumen harus sama dengan contact folder parent",
      );
    }

    contactId = parent.contactId;
  }

  const matter = matterId ? await assertMatterExists(matterId) : null;

  let resolvedContactId = contactId;
  if (matter) {
    if (resolvedContactId && resolvedContactId !== matter.clientId) {
      throw new BadRequestError(
        "Matter tidak sesuai dengan contact yang dipilih",
      );
    }

    if (!resolvedContactId) {
      resolvedContactId = matter.clientId;
    }
  }

  if (resolvedContactId) {
    await assertContactExists(resolvedContactId);
  }

  await assertUniqueNameInParent(name, parentId);

  return await prisma.document.create({
    data: {
      type: data.type,
      name,
      parentId,
      contactId: resolvedContactId,
      matterId,
      physicalLocation: data.physicalLocation,
      hyperlink: data.hyperlink,
      description: data.description,
      fileUrl: data.type === "FILE" ? fileUrl ?? undefined : null,
      fileSize:
        data.type === "FILE"
          ? fileSize ?? data.fileSize ?? undefined
          : null,
    },
    include: {
      contact: { select: { id: true, name: true } },
      matter: {
        select: {
          id: true,
          caseType: true,
          caseArea: true,
          client: { select: { id: true, name: true } },
        },
      },
    },
  });
};

export const updateDocument = async (id: string, data: UpdateDocumentDto) => {
  const existing = await prisma.document.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      parentId: true,
      type: true,
      isDeleted: true,
      contactId: true,
      matterId: true,
    },
  });

  if (!existing || existing.isDeleted) {
    throw new NotFoundError("Dokumen tidak ditemukan");
  }

  const nextName =
    data.name === undefined ? existing.name : normalizeName(data.name);

  if (!nextName) {
    throw new BadRequestError("Nama dokumen tidak boleh kosong");
  }

  const parentInput = normalizeOptionalId(data.parentId);
  const nextParentId =
    parentInput === undefined ? existing.parentId : parentInput;
  const parentChanged =
    parentInput !== undefined && nextParentId !== existing.parentId;

  let nextParent:
    | {
        id: string;
        type: "FILE" | "FOLDER";
        isDeleted: boolean;
        contactId: string | null;
        matterId: string | null;
      }
    | null = null;

  if (nextParentId === existing.id) {
    throw new BadRequestError("Folder tidak bisa berada di dalam dirinya sendiri");
  }

  if (nextParentId && parentChanged) {
    nextParent = await assertParentIsFolder(nextParentId);
  }

  if (nextParentId && !nextParent) {
    nextParent = await assertParentIsFolder(nextParentId);
  }

  if (
    existing.type === "FOLDER" &&
    nextParentId &&
    parentChanged
  ) {
    await assertNotDescendant(existing.id, nextParentId);
  }

  if (nextName !== existing.name || nextParentId !== existing.parentId) {
    await assertUniqueNameInParent(nextName, nextParentId ?? null, existing.id);
  }

  const contactId = normalizeOptionalId(data.contactId);
  const matterId = normalizeOptionalId(data.matterId);
  let nextContactId =
    contactId === undefined ? existing.contactId : contactId;
  let nextMatterId = matterId === undefined ? existing.matterId : matterId;

  if (nextParent?.matterId) {
    if (nextMatterId && nextMatterId !== nextParent.matterId) {
      throw new BadRequestError(
        "Matter dokumen harus sama dengan matter folder parent",
      );
    }

    nextMatterId = nextParent.matterId;
  }

  if (nextParent?.contactId) {
    if (nextContactId && nextContactId !== nextParent.contactId) {
      throw new BadRequestError(
        "Contact dokumen harus sama dengan contact folder parent",
      );
    }

    nextContactId = nextParent.contactId;
  }

  const nextMatter = nextMatterId
    ? await assertMatterExists(nextMatterId)
    : null;
  let resolvedContactId = nextContactId;

  if (nextMatter) {
    if (resolvedContactId && resolvedContactId !== nextMatter.clientId) {
      throw new BadRequestError(
        "Matter tidak sesuai dengan contact yang dipilih",
      );
    }

    if (!resolvedContactId) {
      resolvedContactId = nextMatter.clientId;
    }
  }

  if (resolvedContactId) {
    await assertContactExists(resolvedContactId);
  }

  return await prisma.document.update({
    where: { id },
    data: {
      name: nextName,
      parentId: nextParentId ?? null,
      physicalLocation: data.physicalLocation,
      hyperlink: data.hyperlink,
      description: data.description,
      ...(contactId !== undefined || matterId !== undefined
        ? { contactId: resolvedContactId }
        : {}),
      ...(matterId !== undefined ? { matterId: nextMatterId } : {}),
    },
    include: {
      contact: { select: { id: true, name: true } },
      matter: {
        select: {
          id: true,
          caseType: true,
          caseArea: true,
          client: { select: { id: true, name: true } },
        },
      },
    },
  });
};

export const softDeleteDocument = async (id: string) => {
  const existing = await prisma.document.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!existing) {
    throw new NotFoundError("Dokumen tidak ditemukan");
  }

  const idsToDelete = await collectDescendantIds(id);

  await prisma.document.updateMany({
    where: { id: { in: idsToDelete } },
    data: { isDeleted: true },
  });
};

export const getDocumentById = async (id: string) => {
  return await prisma.document.findFirst({
    where: { id, isDeleted: false },
    include: {
      contact: { select: { id: true, name: true } },
      matter: {
        select: {
          id: true,
          caseType: true,
          caseArea: true,
          client: { select: { id: true, name: true } },
        },
      },
    },
  });
};
