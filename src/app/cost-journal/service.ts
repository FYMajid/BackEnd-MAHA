import {
  CostJournalBillingType,
  CostJournalEntryType,
  Prisma,
} from "@prisma/client";
import { BadRequestError } from "../../error/BadRequestError";
import { NotFoundError } from "../../error/NotFoundError";
import { prisma } from "../../lib/prisma";
import {
  CostJournalListQuery,
  CreateCostJournalDTO,
  UpdateCostJournalDTO,
} from "./dto";

const COST_JOURNAL_INCLUDE = {
  matter: {
    select: {
      id: true,
      caseArea: true,
      caseType: true,
      client: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },
} as const;

const normalizeRequiredId = (value: string | undefined, fieldName: string) => {
  const normalized = value?.trim();
  if (!normalized) {
    throw new BadRequestError(`${fieldName} wajib diisi`);
  }

  return normalized;
};

const normalizeOptionalText = (value?: string | null) => {
  if (value === undefined) {
    return undefined;
  }

  if (value === null) {
    return null;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
};

const normalizeOptionalNumber = (
  value: number | string | null | undefined,
  fieldName: string,
  options: { min?: number; integer?: boolean } = {},
) => {
  if (value === undefined) {
    return undefined;
  }

  if (value === null || value === "") {
    return null;
  }

  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(parsed)) {
    throw new BadRequestError(`${fieldName} harus berupa angka`);
  }

  const enforceInteger = options.integer ?? true;
  if (enforceInteger && !Number.isInteger(parsed)) {
    throw new BadRequestError(`${fieldName} harus berupa bilangan bulat`);
  }

  const min = options.min ?? 0;
  if (parsed < min) {
    throw new BadRequestError(`${fieldName} tidak boleh kurang dari ${min}`);
  }

  return parsed;
};

const normalizeEntryType = (
  value: CostJournalEntryType | string | undefined,
  options: { required?: boolean } = {},
) => {
  const required = options.required ?? true;
  if (value === undefined) {
    if (required) {
      throw new BadRequestError("entryType wajib diisi");
    }

    return undefined;
  }

  const normalized = String(value).trim().toUpperCase();
  if (normalized !== "EXPENSE" && normalized !== "TIME") {
    throw new BadRequestError("entryType harus EXPENSE atau TIME");
  }

  return normalized as CostJournalEntryType;
};

const normalizeBillingType = (
  value: CostJournalBillingType | string | undefined,
  options: { required?: boolean; defaultValue?: CostJournalBillingType } = {},
) => {
  const required = options.required ?? false;
  const defaultValue = options.defaultValue;

  if (value === undefined) {
    if (defaultValue) {
      return defaultValue;
    }

    if (required) {
      throw new BadRequestError("billingType wajib diisi");
    }

    return undefined;
  }

  const normalized = String(value).trim().toUpperCase();
  if (normalized !== "BILLABLE" && normalized !== "NON_BILLABLE") {
    throw new BadRequestError("billingType harus BILLABLE atau NON_BILLABLE");
  }

  return normalized as CostJournalBillingType;
};

const normalizeRequiredDate = (value: string | undefined, fieldName: string) => {
  if (!value) {
    throw new BadRequestError(`${fieldName} wajib diisi`);
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw new BadRequestError(`${fieldName} tidak valid`);
  }

  return parsed;
};

const assertMatterExists = async (matterId: string) => {
  const matter = await prisma.matter.findUnique({
    where: { id: matterId },
    select: { id: true },
  });

  if (!matter) {
    throw new BadRequestError("Matter tidak ditemukan");
  }
};

const computeCostPayload = (input: {
  entryType: CostJournalEntryType;
  quantity: number | null;
  unitCost: number | null;
  durationMinutes: number | null;
  hourlyRate: number | null;
}) => {
  if (input.entryType === "EXPENSE") {
    const quantity = input.quantity ?? 1;
    const unitCost = input.unitCost;

    if (unitCost === null) {
      throw new BadRequestError("unitCost wajib diisi untuk entry EXPENSE");
    }

    return {
      quantity,
      unitCost,
      durationMinutes: null,
      hourlyRate: null,
      totalCost: quantity * unitCost,
    };
  }

  const durationMinutes = input.durationMinutes;
  const hourlyRate = input.hourlyRate;

  if (durationMinutes === null) {
    throw new BadRequestError(
      "durationMinutes wajib diisi untuk entry TIME",
    );
  }

  if (hourlyRate === null) {
    throw new BadRequestError("hourlyRate wajib diisi untuk entry TIME");
  }

  return {
    quantity: null,
    unitCost: null,
    durationMinutes,
    hourlyRate,
    totalCost: Math.round((durationMinutes * hourlyRate) / 60),
  };
};

const toNullableNumber = (value: number | null | undefined) => {
  return value ?? null;
};

export const getAllCostJournals = async (query: CostJournalListQuery = {}) => {
  const search = query.search?.trim();
  const entryType = normalizeEntryType(query.type, { required: false });
  const billingType = normalizeBillingType(query.billingType, {
    required: false,
  });
  const matterId = query.matterId?.trim();

  const where: Prisma.CostJournalWhereInput = {};

  if (entryType) {
    where.entryType = entryType;
  }

  if (billingType) {
    where.billingType = billingType;
  }

  if (matterId) {
    where.matterId = matterId;
  }

  if (search) {
    where.OR = [
      {
        category: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        description: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        matter: {
          caseArea: {
            contains: search,
            mode: "insensitive",
          },
        },
      },
      {
        matter: {
          caseType: {
            contains: search,
            mode: "insensitive",
          },
        },
      },
      {
        matter: {
          client: {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
      },
    ];
  }

  return await prisma.costJournal.findMany({
    where,
    include: COST_JOURNAL_INCLUDE,
    orderBy: [{ entryDate: "desc" }, { createdAt: "desc" }],
  });
};

export const getCostJournalById = async (id: string) => {
  const record = await prisma.costJournal.findUnique({
    where: { id },
    include: COST_JOURNAL_INCLUDE,
  });

  if (!record) {
    throw new NotFoundError("Cost journal tidak ditemukan");
  }

  return record;
};

export const createCostJournal = async (data: CreateCostJournalDTO) => {
  const matterId = normalizeRequiredId(data.matterId, "matterId");
  const entryType = normalizeEntryType(data.entryType, {
    required: true,
  }) as CostJournalEntryType;
  const billingType = normalizeBillingType(data.billingType, {
    defaultValue: "BILLABLE",
  });
  const entryDate = normalizeRequiredDate(data.entryDate, "entryDate");

  await assertMatterExists(matterId);

  const quantity = toNullableNumber(
    normalizeOptionalNumber(data.quantity, "quantity", {
      min: 0,
      integer: true,
    }),
  );
  const unitCost = toNullableNumber(
    normalizeOptionalNumber(data.unitCost, "unitCost", {
      min: 0,
      integer: true,
    }),
  );
  const durationMinutes = toNullableNumber(
    normalizeOptionalNumber(data.durationMinutes, "durationMinutes", {
      min: 0,
      integer: true,
    }),
  );
  const hourlyRate = toNullableNumber(
    normalizeOptionalNumber(data.hourlyRate, "hourlyRate", {
      min: 0,
      integer: true,
    }),
  );

  const computed = computeCostPayload({
    entryType,
    quantity,
    unitCost,
    durationMinutes,
    hourlyRate,
  });

  return await prisma.costJournal.create({
    data: {
      matterId,
      entryType,
      billingType,
      category: normalizeOptionalText(data.category),
      entryDate,
      description: normalizeOptionalText(data.description),
      quantity: computed.quantity,
      unitCost: computed.unitCost,
      durationMinutes: computed.durationMinutes,
      hourlyRate: computed.hourlyRate,
      totalCost: computed.totalCost,
      attachmentUrl: normalizeOptionalText(data.attachmentUrl),
      createdBy: normalizeOptionalText(data.createdBy),
    },
    include: COST_JOURNAL_INCLUDE,
  });
};

export const updateCostJournal = async (id: string, data: UpdateCostJournalDTO) => {
  const existing = await prisma.costJournal.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new NotFoundError("Cost journal tidak ditemukan");
  }

  const matterId =
    data.matterId === undefined
      ? existing.matterId
      : normalizeRequiredId(data.matterId, "matterId");

  if (matterId !== existing.matterId) {
    await assertMatterExists(matterId);
  }

  const entryType =
    data.entryType === undefined
      ? existing.entryType
      : (normalizeEntryType(data.entryType, {
          required: true,
        }) as CostJournalEntryType);

  const billingType =
    data.billingType === undefined
      ? existing.billingType
      : normalizeBillingType(data.billingType, {
          required: true,
        });

  const entryDate =
    data.entryDate === undefined
      ? existing.entryDate
      : normalizeRequiredDate(data.entryDate, "entryDate");

  const quantity =
    data.quantity === undefined
      ? existing.quantity
      : toNullableNumber(
          normalizeOptionalNumber(data.quantity, "quantity", {
            min: 0,
            integer: true,
          }),
        );

  const unitCost =
    data.unitCost === undefined
      ? existing.unitCost
      : toNullableNumber(
          normalizeOptionalNumber(data.unitCost, "unitCost", {
            min: 0,
            integer: true,
          }),
        );

  const durationMinutes =
    data.durationMinutes === undefined
      ? existing.durationMinutes
      : toNullableNumber(
          normalizeOptionalNumber(data.durationMinutes, "durationMinutes", {
            min: 0,
            integer: true,
          }),
        );

  const hourlyRate =
    data.hourlyRate === undefined
      ? existing.hourlyRate
      : toNullableNumber(
          normalizeOptionalNumber(data.hourlyRate, "hourlyRate", {
            min: 0,
            integer: true,
          }),
        );

  const computed = computeCostPayload({
    entryType,
    quantity,
    unitCost,
    durationMinutes,
    hourlyRate,
  });

  return await prisma.costJournal.update({
    where: { id },
    data: {
      matterId,
      entryType,
      billingType,
      entryDate,
      category:
        data.category === undefined
          ? existing.category
          : normalizeOptionalText(data.category),
      description:
        data.description === undefined
          ? existing.description
          : normalizeOptionalText(data.description),
      quantity: computed.quantity,
      unitCost: computed.unitCost,
      durationMinutes: computed.durationMinutes,
      hourlyRate: computed.hourlyRate,
      totalCost: computed.totalCost,
      attachmentUrl:
        data.attachmentUrl === undefined
          ? existing.attachmentUrl
          : normalizeOptionalText(data.attachmentUrl),
      createdBy:
        data.createdBy === undefined
          ? existing.createdBy
          : normalizeOptionalText(data.createdBy),
    },
    include: COST_JOURNAL_INCLUDE,
  });
};

export const deleteCostJournal = async (id: string) => {
  const existing = await prisma.costJournal.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!existing) {
    throw new NotFoundError("Cost journal tidak ditemukan");
  }

  await prisma.costJournal.delete({
    where: { id },
  });
};
