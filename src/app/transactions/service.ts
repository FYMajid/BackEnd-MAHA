import {
  DepositActionType,
  InvoiceStatus,
  PaymentProofStatus,
  Prisma,
} from "@prisma/client";
import { BadRequestError } from "../../error/BadRequestError";
import { ConflictError } from "../../error/ConflictError";
import { NotFoundError } from "../../error/NotFoundError";
import { prisma } from "../../lib/prisma";
import {
  CreateDepositDTO,
  CreateInvoiceDTO,
  CreatePaymentProofDTO,
  DepositListQuery,
  InvoiceItemInput,
  InvoiceListQuery,
  PaymentProofListQuery,
  UpdateDepositDTO,
  UpdateInvoiceDTO,
  UpdatePaymentProofDTO,
} from "./dto";

type PrismaDb = Prisma.TransactionClient | typeof prisma;

const INVOICE_INCLUDE = {
  client: {
    select: {
      id: true,
      name: true,
    },
  },
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
  items: true,
  paymentProofs: true,
};

const PAYMENT_PROOF_INCLUDE = {
  invoice: {
    select: {
      id: true,
      invoiceNo: true,
      totalAmount: true,
      status: true,
      client: {
        select: {
          id: true,
          name: true,
        },
      },
      matter: {
        select: {
          id: true,
          caseArea: true,
          caseType: true,
        },
      },
    },
  },
};

const DEPOSIT_INCLUDE = {
  client: {
    select: {
      id: true,
      name: true,
    },
  },
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
};

type InvoiceRecord = Prisma.InvoiceGetPayload<{
  include: typeof INVOICE_INCLUDE;
}>;

type PaymentProofRecord = Prisma.PaymentProofGetPayload<{
  include: typeof PAYMENT_PROOF_INCLUDE;
}>;

type DepositRecord = Prisma.DepositAccountGetPayload<{
  include: typeof DEPOSIT_INCLUDE;
}>;

const normalizeRequiredId = (value: string | undefined, fieldName: string) => {
  const normalized = value?.trim();
  if (!normalized) {
    throw new BadRequestError(`${fieldName} wajib diisi`);
  }

  return normalized;
};

const normalizeNullableId = (value?: string | null) => {
  if (value === undefined) {
    return undefined;
  }

  if (value === null) {
    return null;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
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

const normalizeRequiredText = (
  value: string | undefined,
  fieldName: string,
) => {
  const normalized = value?.trim();
  if (!normalized) {
    throw new BadRequestError(`${fieldName} wajib diisi`);
  }

  return normalized;
};

const normalizeInteger = (
  value: number | string | null | undefined,
  fieldName: string,
  options: {
    min?: number;
    max?: number;
    required?: boolean;
    defaultValue?: number;
  } = {},
) => {
  const required = options.required ?? false;

  if (value === undefined) {
    if (options.defaultValue !== undefined) {
      return options.defaultValue;
    }

    if (required) {
      throw new BadRequestError(`${fieldName} wajib diisi`);
    }

    return undefined;
  }

  if (value === null || value === "") {
    if (required) {
      throw new BadRequestError(`${fieldName} wajib diisi`);
    }

    if (options.defaultValue !== undefined) {
      return options.defaultValue;
    }

    return null;
  }

  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(parsed) || !Number.isInteger(parsed)) {
    throw new BadRequestError(`${fieldName} harus berupa bilangan bulat`);
  }

  const min = options.min ?? 0;
  if (parsed < min) {
    throw new BadRequestError(`${fieldName} tidak boleh kurang dari ${min}`);
  }

  if (options.max !== undefined && parsed > options.max) {
    throw new BadRequestError(
      `${fieldName} tidak boleh lebih dari ${options.max}`,
    );
  }

  return parsed;
};

const normalizeRequiredDate = (
  value: string | undefined,
  fieldName: string,
) => {
  if (!value) {
    throw new BadRequestError(`${fieldName} wajib diisi`);
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw new BadRequestError(`${fieldName} tidak valid`);
  }

  return parsed;
};

const normalizeInvoiceStatusFilter = (
  value?: InvoiceStatus | "UNPAID" | string,
) => {
  const normalized = value?.trim().toUpperCase();
  if (!normalized || normalized === "ALL") {
    return undefined;
  }

  if (normalized === "UNPAID") {
    return "UNPAID" as const;
  }

  if (
    normalized === "DRAFT" ||
    normalized === "PENDING" ||
    normalized === "PAID" ||
    normalized === "OVERDUE"
  ) {
    return normalized as InvoiceStatus;
  }

  throw new BadRequestError("status invoice tidak valid");
};

const normalizePaymentProofStatusFilter = (
  value?: PaymentProofStatus | string,
) => {
  const normalized = value?.trim().toUpperCase();
  if (!normalized || normalized === "ALL") {
    return undefined;
  }

  if (normalized === "PENDING" || normalized === "VERIFIED") {
    return normalized as PaymentProofStatus;
  }

  throw new BadRequestError("status payment proof tidak valid");
};

const normalizeDepositAction = (
  value: DepositActionType | string | undefined,
) => {
  const normalized = value?.trim().toUpperCase();
  if (!normalized) {
    throw new BadRequestError("action wajib diisi");
  }

  if (normalized !== "ADD" && normalized !== "REFUND") {
    throw new BadRequestError("action harus ADD atau REFUND");
  }

  return normalized as DepositActionType;
};

const pad = (value: number, size = 2) => String(value).padStart(size, "0");

const generateInvoiceNo = () => {
  const now = new Date();
  return `INV-${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}${pad(now.getMilliseconds(), 3)}`;
};

const assertContactExists = async (db: PrismaDb, contactId: string) => {
  const contact = await db.contact.findUnique({
    where: { id: contactId },
    select: { id: true },
  });

  if (!contact) {
    throw new BadRequestError("Client tidak ditemukan");
  }

  return contact;
};

const assertMatterExists = async (db: PrismaDb, matterId: string) => {
  const matter = await db.matter.findUnique({
    where: { id: matterId },
    select: {
      id: true,
      clientId: true,
    },
  });

  if (!matter) {
    throw new BadRequestError("Matter tidak ditemukan");
  }

  return matter;
};

const assertInvoiceNumberUnique = async (
  db: PrismaDb,
  invoiceNo: string,
  excludeId?: string,
) => {
  const existing = await db.invoice.findFirst({
    where: {
      invoiceNo,
      ...(excludeId ? { id: { not: excludeId } } : {}),
    },
    select: { id: true },
  });

  if (existing) {
    throw new ConflictError("Nomor invoice sudah digunakan");
  }
};

const normalizeInvoiceItems = (items?: InvoiceItemInput[]) => {
  if (items === undefined) {
    return undefined;
  }

  if (!Array.isArray(items) || items.length === 0) {
    throw new BadRequestError("items invoice wajib diisi");
  }

  return items.map((item, index) => {
    const description = normalizeRequiredText(
      item?.description,
      `items[${index}].description`,
    );
    const quantity = normalizeInteger(
      item?.quantity ?? item?.qty,
      `items[${index}].quantity`,
      {
        min: 1,
        required: true,
      },
    ) as number;
    const rate = normalizeInteger(item?.rate, `items[${index}].rate`, {
      min: 0,
      required: true,
    }) as number;

    return {
      description,
      quantity,
      rate,
      amount: quantity * rate,
    };
  });
};

const computeInvoiceTotals = (
  items: Array<{ amount: number }>,
  taxPercent: number,
) => {
  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const taxAmount = Math.round((subtotal * taxPercent) / 100);
  return {
    subtotal,
    taxAmount,
    totalAmount: subtotal + taxAmount,
  };
};

const resolveInvoiceStatus = (
  record: Pick<
    InvoiceRecord,
    "dueDate" | "items" | "totalAmount" | "paymentProofs"
  >,
) => {
  if (record.items.length === 0) {
    return "DRAFT" as const;
  }

  const verifiedAmount = record.paymentProofs
    .filter((proof) => proof.status === "VERIFIED")
    .reduce((sum, proof) => sum + proof.amountPaid, 0);

  if (record.totalAmount > 0 && verifiedAmount >= record.totalAmount) {
    return "PAID" as const;
  }

  if (record.dueDate.getTime() < Date.now()) {
    return "OVERDUE" as const;
  }

  return "PENDING" as const;
};

const mapInvoiceRecord = (record: InvoiceRecord) => {
  return {
    ...record,
    status: resolveInvoiceStatus(record),
  };
};

const mapPaymentProofRecord = (record: PaymentProofRecord) => record;

const buildDepositLookupWhere = (
  clientId: string,
  matterId: string | null,
  excludeId?: string,
): Prisma.DepositAccountWhereInput => ({
  clientId,
  ...(matterId ? { matterId } : { matterId: null }),
  ...(excludeId ? { id: { not: excludeId } } : {}),
});

const getMatterUtilizationMap = async (matterIds: string[]) => {
  if (matterIds.length === 0) {
    return new Map<string, number>();
  }

  const grouped = await prisma.costJournal.groupBy({
    by: ["matterId"],
    where: {
      matterId: {
        in: matterIds,
      },
    },
    _sum: {
      totalCost: true,
    },
  });

  return new Map(
    grouped.map((item) => [item.matterId, item._sum.totalCost ?? 0]),
  );
};

const enrichDepositRecords = async (records: DepositRecord[]) => {
  const matterIds = records
    .map((record) => record.matterId)
    .filter((value): value is string => Boolean(value));
  const utilizationMap = await getMatterUtilizationMap(matterIds);

  return records.map((record) => {
    const utilizedAmount = record.matterId
      ? (utilizationMap.get(record.matterId) ?? 0)
      : 0;
    const availableAmount = Math.max(
      record.amount - utilizedAmount - record.refundedAmount,
      0,
    );
    const utilizationPercent =
      record.amount > 0
        ? Math.min(100, Math.round((utilizedAmount / record.amount) * 100))
        : 0;

    return {
      ...record,
      utilizedAmount,
      availableAmount,
      utilizationPercent,
    };
  });
};

const getAvailableDepositBalance = async (record: DepositRecord) => {
  const [enriched] = await enrichDepositRecords([record]);
  return enriched?.availableAmount ?? 0;
};

const syncInvoicePaymentState = async (db: PrismaDb, invoiceId: string) => {
  const invoice = await db.invoice.findUnique({
    where: { id: invoiceId },
    include: {
      items: true,
      paymentProofs: true,
    },
  });

  if (!invoice) {
    throw new NotFoundError("Invoice tidak ditemukan");
  }

  const totalPaid = invoice.paymentProofs.reduce(
    (sum, proof) => sum + proof.amountPaid,
    0,
  );
  const fullyPaid = invoice.totalAmount > 0 && totalPaid >= invoice.totalAmount;

  await db.paymentProof.updateMany({
    where: {
      invoiceId,
    },
    data: {
      status: fullyPaid ? "VERIFIED" : "PENDING",
      verifiedBy: fullyPaid ? "System" : null,
    },
  });

  const status =
    invoice.items.length === 0
      ? "DRAFT"
      : fullyPaid
        ? "PAID"
        : invoice.dueDate.getTime() < Date.now()
          ? "OVERDUE"
          : "PENDING";

  await db.invoice.update({
    where: { id: invoiceId },
    data: { status },
  });
};

export const getAllInvoices = async (query: InvoiceListQuery = {}) => {
  const search = query.search?.trim();
  const clientId = query.clientId?.trim();
  const matterId = query.matterId?.trim();
  const statusFilter = normalizeInvoiceStatusFilter(query.status);

  const where: Prisma.InvoiceWhereInput = {};

  if (clientId) {
    where.clientId = clientId;
  }

  if (matterId) {
    where.matterId = matterId;
  }

  if (search) {
    where.OR = [
      {
        invoiceNo: {
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
        notes: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        client: {
          name: {
            contains: search,
            mode: "insensitive",
          },
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
    ];
  }

  const records = await prisma.invoice.findMany({
    where,
    include: INVOICE_INCLUDE,
    orderBy: [{ invoiceDate: "desc" }, { createdAt: "desc" }],
  });

  const resolved = records.map(mapInvoiceRecord);

  if (!statusFilter) {
    return resolved;
  }

  if (statusFilter === "UNPAID") {
    return resolved.filter(
      (record) => record.status === "PENDING" || record.status === "OVERDUE",
    );
  }

  return resolved.filter((record) => record.status === statusFilter);
};

export const getInvoiceById = async (id: string) => {
  const record = await prisma.invoice.findUnique({
    where: { id },
    include: INVOICE_INCLUDE,
  });

  if (!record) {
    throw new NotFoundError("Invoice tidak ditemukan");
  }

  return mapInvoiceRecord(record);
};

export const createInvoice = async (data: CreateInvoiceDTO) => {
  const clientId = normalizeRequiredId(data.clientId, "clientId");
  const matterId = normalizeRequiredId(data.matterId, "matterId");
  const invoiceDate = normalizeRequiredDate(data.invoiceDate, "invoiceDate");
  const dueDate = normalizeRequiredDate(data.dueDate, "dueDate");
  const taxPercent =
    normalizeInteger(data.taxPercent, "taxPercent", {
      min: 0,
      max: 100,
      defaultValue: 0,
    }) ?? 0;
  const items = normalizeInvoiceItems(data.items) ?? [];

  if (dueDate.getTime() < invoiceDate.getTime()) {
    throw new BadRequestError(
      "dueDate tidak boleh lebih awal dari invoiceDate",
    );
  }

  return await prisma.$transaction(async (tx) => {
    await assertContactExists(tx, clientId);
    const matter = await assertMatterExists(tx, matterId);

    if (matter.clientId !== clientId) {
      throw new BadRequestError(
        "Matter tidak sesuai dengan client yang dipilih",
      );
    }

    const invoiceNo =
      normalizeOptionalText(data.invoiceNo) ?? generateInvoiceNo();
    await assertInvoiceNumberUnique(tx, invoiceNo);

    const totals = computeInvoiceTotals(items, taxPercent);

    const created = await tx.invoice.create({
      data: {
        invoiceNo,
        clientId,
        matterId,
        invoiceDate,
        dueDate,
        paymentTerms: normalizeOptionalText(data.paymentTerms),
        description: normalizeOptionalText(data.description),
        notes: normalizeOptionalText(data.notes),
        taxPercent,
        subtotal: totals.subtotal,
        taxAmount: totals.taxAmount,
        totalAmount: totals.totalAmount,
        status: dueDate.getTime() < Date.now() ? "OVERDUE" : "PENDING",
        items: {
          create: items.map((item) => ({
            description: item.description,
            quantity: item.quantity,
            rate: item.rate,
            amount: item.amount,
          })),
        },
      },
      include: INVOICE_INCLUDE,
    });

    return mapInvoiceRecord(created);
  });
};

export const updateInvoice = async (id: string, data: UpdateInvoiceDTO) => {
  const existing = await prisma.invoice.findUnique({
    where: { id },
    include: {
      items: true,
    },
  });

  if (!existing) {
    throw new NotFoundError("Invoice tidak ditemukan");
  }

  const nextClientId =
    data.clientId === undefined
      ? existing.clientId
      : normalizeRequiredId(data.clientId, "clientId");
  const nextMatterId =
    data.matterId === undefined
      ? existing.matterId
      : normalizeRequiredId(data.matterId, "matterId");
  const nextInvoiceDate =
    data.invoiceDate === undefined
      ? existing.invoiceDate
      : normalizeRequiredDate(data.invoiceDate, "invoiceDate");
  const nextDueDate =
    data.dueDate === undefined
      ? existing.dueDate
      : normalizeRequiredDate(data.dueDate, "dueDate");

  if (nextDueDate.getTime() < nextInvoiceDate.getTime()) {
    throw new BadRequestError(
      "dueDate tidak boleh lebih awal dari invoiceDate",
    );
  }

  const nextTaxPercent =
    data.taxPercent === undefined
      ? existing.taxPercent
      : ((normalizeInteger(data.taxPercent, "taxPercent", {
          min: 0,
          max: 100,
          defaultValue: 0,
        }) ?? 0) as number);

  const nextItems =
    data.items === undefined
      ? existing.items.map((item) => ({
          description: item.description,
          quantity: item.quantity,
          rate: item.rate,
          amount: item.amount,
        }))
      : (normalizeInvoiceItems(data.items) ?? []);

  return await prisma.$transaction(async (tx) => {
    await assertContactExists(tx, nextClientId);
    const matter = await assertMatterExists(tx, nextMatterId);

    if (matter.clientId !== nextClientId) {
      throw new BadRequestError(
        "Matter tidak sesuai dengan client yang dipilih",
      );
    }

    const invoiceNo =
      normalizeOptionalText(data.invoiceNo) ?? existing.invoiceNo;
    await assertInvoiceNumberUnique(tx, invoiceNo, id);

    const totals = computeInvoiceTotals(nextItems, nextTaxPercent);

    await tx.invoice.update({
      where: { id },
      data: {
        invoiceNo,
        clientId: nextClientId,
        matterId: nextMatterId,
        invoiceDate: nextInvoiceDate,
        dueDate: nextDueDate,
        paymentTerms:
          data.paymentTerms === undefined
            ? existing.paymentTerms
            : normalizeOptionalText(data.paymentTerms),
        description:
          data.description === undefined
            ? existing.description
            : normalizeOptionalText(data.description),
        notes:
          data.notes === undefined
            ? existing.notes
            : normalizeOptionalText(data.notes),
        taxPercent: nextTaxPercent,
        subtotal: totals.subtotal,
        taxAmount: totals.taxAmount,
        totalAmount: totals.totalAmount,
        items: {
          deleteMany: {},
          create: nextItems.map((item) => ({
            description: item.description,
            quantity: item.quantity,
            rate: item.rate,
            amount: item.amount,
          })),
        },
      },
    });

    await syncInvoicePaymentState(tx, id);

    const updated = await tx.invoice.findUnique({
      where: { id },
      include: INVOICE_INCLUDE,
    });

    if (!updated) {
      throw new NotFoundError("Invoice tidak ditemukan");
    }

    return mapInvoiceRecord(updated);
  });
};

export const deleteInvoice = async (id: string) => {
  const existing = await prisma.invoice.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!existing) {
    throw new NotFoundError("Invoice tidak ditemukan");
  }

  await prisma.invoice.delete({
    where: { id },
  });
};

export const getAllPaymentProofs = async (
  query: PaymentProofListQuery = {},
) => {
  const search = query.search?.trim();
  const invoiceId = query.invoiceId?.trim();
  const statusFilter = normalizePaymentProofStatusFilter(query.status);

  const where: Prisma.PaymentProofWhereInput = {};

  if (invoiceId) {
    where.invoiceId = invoiceId;
  }

  if (statusFilter) {
    where.status = statusFilter;
  }

  if (search) {
    where.OR = [
      {
        referenceNo: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        notes: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        invoice: {
          invoiceNo: {
            contains: search,
            mode: "insensitive",
          },
        },
      },
      {
        invoice: {
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

  const records = await prisma.paymentProof.findMany({
    where,
    include: PAYMENT_PROOF_INCLUDE,
    orderBy: [{ paymentDate: "desc" }, { createdAt: "desc" }],
  });

  return records.map(mapPaymentProofRecord);
};

export const getPaymentProofById = async (id: string) => {
  const record = await prisma.paymentProof.findUnique({
    where: { id },
    include: PAYMENT_PROOF_INCLUDE,
  });

  if (!record) {
    throw new NotFoundError("Payment proof tidak ditemukan");
  }

  return mapPaymentProofRecord(record);
};

export const createPaymentProof = async (
  data: CreatePaymentProofDTO,
  fileUrl?: string,
) => {
  const invoiceId = normalizeRequiredId(data.invoiceId, "invoiceId");
  const paymentDate = normalizeRequiredDate(data.paymentDate, "paymentDate");
  const amountPaid = normalizeInteger(data.amountPaid, "amountPaid", {
    min: 1,
    required: true,
  }) as number;

  return await prisma.$transaction(async (tx) => {
    const invoice = await tx.invoice.findUnique({
      where: { id: invoiceId },
      select: { id: true },
    });

    if (!invoice) {
      throw new BadRequestError("Invoice tidak ditemukan");
    }

    const created = await tx.paymentProof.create({
      data: {
        invoiceId,
        paymentDate,
        amountPaid,
        paymentMethod: normalizeOptionalText(data.paymentMethod),
        referenceNo: normalizeOptionalText(data.referenceNo),
        notes: normalizeOptionalText(data.notes),
        fileUrl: normalizeOptionalText(fileUrl) ?? null,
      },
      include: PAYMENT_PROOF_INCLUDE,
    });

    await syncInvoicePaymentState(tx, invoiceId);

    const refreshed = await tx.paymentProof.findUnique({
      where: { id: created.id },
      include: PAYMENT_PROOF_INCLUDE,
    });

    if (!refreshed) {
      throw new NotFoundError("Payment proof tidak ditemukan");
    }

    return mapPaymentProofRecord(refreshed);
  });
};

export const updatePaymentProof = async (
  id: string,
  data: UpdatePaymentProofDTO,
  fileUrl?: string,
) => {
  const existing = await prisma.paymentProof.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new NotFoundError("Payment proof tidak ditemukan");
  }

  const nextInvoiceId =
    data.invoiceId === undefined
      ? existing.invoiceId
      : normalizeRequiredId(data.invoiceId, "invoiceId");
  const nextPaymentDate =
    data.paymentDate === undefined
      ? existing.paymentDate
      : normalizeRequiredDate(data.paymentDate, "paymentDate");
  const nextAmountPaid =
    data.amountPaid === undefined
      ? existing.amountPaid
      : (normalizeInteger(data.amountPaid, "amountPaid", {
          min: 1,
          required: true,
        }) as number);

  return await prisma.$transaction(async (tx) => {
    const invoice = await tx.invoice.findUnique({
      where: { id: nextInvoiceId },
      select: { id: true },
    });

    if (!invoice) {
      throw new BadRequestError("Invoice tidak ditemukan");
    }

    await tx.paymentProof.update({
      where: { id },
      data: {
        invoiceId: nextInvoiceId,
        paymentDate: nextPaymentDate,
        amountPaid: nextAmountPaid,
        paymentMethod:
          data.paymentMethod === undefined
            ? existing.paymentMethod
            : normalizeOptionalText(data.paymentMethod),
        referenceNo:
          data.referenceNo === undefined
            ? existing.referenceNo
            : normalizeOptionalText(data.referenceNo),
        notes:
          data.notes === undefined
            ? existing.notes
            : normalizeOptionalText(data.notes),
        ...(fileUrl !== undefined
          ? { fileUrl: normalizeOptionalText(fileUrl) ?? null }
          : {}),
      },
    });

    await syncInvoicePaymentState(tx, existing.invoiceId);
    if (nextInvoiceId !== existing.invoiceId) {
      await syncInvoicePaymentState(tx, nextInvoiceId);
    }

    const updated = await tx.paymentProof.findUnique({
      where: { id },
      include: PAYMENT_PROOF_INCLUDE,
    });

    if (!updated) {
      throw new NotFoundError("Payment proof tidak ditemukan");
    }

    return mapPaymentProofRecord(updated);
  });
};

export const deletePaymentProof = async (id: string) => {
  const existing = await prisma.paymentProof.findUnique({
    where: { id },
    select: { id: true, invoiceId: true },
  });

  if (!existing) {
    throw new NotFoundError("Payment proof tidak ditemukan");
  }

  await prisma.$transaction(async (tx) => {
    await tx.paymentProof.delete({
      where: { id },
    });

    await syncInvoicePaymentState(tx, existing.invoiceId);
  });
};

export const getAllDepositAccounts = async (query: DepositListQuery = {}) => {
  const search = query.search?.trim();
  const clientId = query.clientId?.trim();
  const matterId = query.matterId?.trim();

  const where: Prisma.DepositAccountWhereInput = {};

  if (clientId) {
    where.clientId = clientId;
  }

  if (matterId) {
    where.matterId = matterId;
  }

  if (search) {
    where.OR = [
      {
        client: {
          name: {
            contains: search,
            mode: "insensitive",
          },
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
        referenceNo: {
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
    ];
  }

  const records = await prisma.depositAccount.findMany({
    where,
    include: DEPOSIT_INCLUDE,
    orderBy: [{ lastTransactionDate: "desc" }, { createdAt: "desc" }],
  });

  return await enrichDepositRecords(records);
};

export const getDepositAccountById = async (id: string) => {
  const record = await prisma.depositAccount.findUnique({
    where: { id },
    include: DEPOSIT_INCLUDE,
  });

  if (!record) {
    throw new NotFoundError("Deposit account tidak ditemukan");
  }

  const [enriched] = await enrichDepositRecords([record]);
  return enriched;
};

export const createDepositAction = async (data: CreateDepositDTO) => {
  const action = normalizeDepositAction(data.action);
  const clientId = normalizeRequiredId(data.clientId, "clientId");
  const matterId = normalizeNullableId(data.matterId) ?? null;
  const transactionDate = normalizeRequiredDate(
    data.transactionDate,
    "transactionDate",
  );
  const amount = normalizeInteger(data.amount, "amount", {
    min: 1,
    required: true,
  }) as number;

  return await prisma.$transaction(async (tx) => {
    await assertContactExists(tx, clientId);

    if (matterId) {
      const matter = await assertMatterExists(tx, matterId);
      if (matter.clientId !== clientId) {
        throw new BadRequestError(
          "Matter tidak sesuai dengan client yang dipilih",
        );
      }
    }

    const existing = await tx.depositAccount.findFirst({
      where: buildDepositLookupWhere(clientId, matterId),
      include: DEPOSIT_INCLUDE,
    });

    if (action === "ADD") {
      const record = existing
        ? await tx.depositAccount.update({
            where: { id: existing.id },
            data: {
              amount: existing.amount + amount,
              lastTransactionDate: transactionDate,
              paymentMethod: normalizeOptionalText(data.paymentMethod),
              referenceNo: normalizeOptionalText(data.referenceNo),
              description: normalizeOptionalText(data.description),
              lastActionType: "ADD",
            },
            include: DEPOSIT_INCLUDE,
          })
        : await tx.depositAccount.create({
            data: {
              clientId,
              matterId,
              amount,
              refundedAmount: 0,
              lastTransactionDate: transactionDate,
              paymentMethod: normalizeOptionalText(data.paymentMethod),
              referenceNo: normalizeOptionalText(data.referenceNo),
              description: normalizeOptionalText(data.description),
              lastActionType: "ADD",
            },
            include: DEPOSIT_INCLUDE,
          });

      const [enriched] = await enrichDepositRecords([record]);
      return enriched;
    }

    if (!existing) {
      throw new NotFoundError("Deposit account tidak ditemukan untuk refund");
    }

    const availableBalance = await getAvailableDepositBalance(existing);
    if (amount > availableBalance) {
      throw new BadRequestError("Nominal refund melebihi saldo tersedia");
    }

    const updated = await tx.depositAccount.update({
      where: { id: existing.id },
      data: {
        refundedAmount: existing.refundedAmount + amount,
        lastTransactionDate: transactionDate,
        paymentMethod: normalizeOptionalText(data.paymentMethod),
        referenceNo: normalizeOptionalText(data.referenceNo),
        description: normalizeOptionalText(data.description),
        lastActionType: "REFUND",
      },
      include: DEPOSIT_INCLUDE,
    });

    const [enriched] = await enrichDepositRecords([updated]);
    return enriched;
  });
};

export const updateDepositAccount = async (
  id: string,
  data: UpdateDepositDTO,
) => {
  const existing = await prisma.depositAccount.findUnique({
    where: { id },
    include: DEPOSIT_INCLUDE,
  });

  if (!existing) {
    throw new NotFoundError("Deposit account tidak ditemukan");
  }

  const nextClientId =
    data.clientId === undefined
      ? existing.clientId
      : normalizeRequiredId(data.clientId, "clientId");
  const normalizedMatterInput = normalizeNullableId(data.matterId);
  const nextMatterId =
    normalizedMatterInput === undefined
      ? existing.matterId
      : normalizedMatterInput;
  const nextTransactionDate =
    data.transactionDate === undefined
      ? existing.lastTransactionDate
      : normalizeRequiredDate(data.transactionDate, "transactionDate");
  const nextAmount =
    data.amount === undefined
      ? existing.amount
      : (normalizeInteger(data.amount, "amount", {
          min: 0,
          required: true,
        }) as number);

  await assertContactExists(prisma, nextClientId);
  if (nextMatterId) {
    const matter = await assertMatterExists(prisma, nextMatterId);
    if (matter.clientId !== nextClientId) {
      throw new BadRequestError(
        "Matter tidak sesuai dengan client yang dipilih",
      );
    }
  }

  const conflict = await prisma.depositAccount.findFirst({
    where: buildDepositLookupWhere(nextClientId, nextMatterId ?? null, id),
    select: { id: true },
  });

  if (conflict) {
    throw new ConflictError(
      "Deposit account untuk client dan matter tersebut sudah ada",
    );
  }

  const currentUtilized = existing.matterId
    ? ((await getMatterUtilizationMap([existing.matterId])).get(
        existing.matterId,
      ) ?? 0)
    : 0;

  if (nextAmount < existing.refundedAmount + currentUtilized) {
    throw new BadRequestError(
      "amount tidak boleh lebih kecil dari total utilized dan refunded",
    );
  }

  const updated = await prisma.depositAccount.update({
    where: { id },
    data: {
      clientId: nextClientId,
      matterId: nextMatterId ?? null,
      amount: nextAmount,
      lastTransactionDate: nextTransactionDate,
      paymentMethod:
        data.paymentMethod === undefined
          ? existing.paymentMethod
          : normalizeOptionalText(data.paymentMethod),
      referenceNo:
        data.referenceNo === undefined
          ? existing.referenceNo
          : normalizeOptionalText(data.referenceNo),
      description:
        data.description === undefined
          ? existing.description
          : normalizeOptionalText(data.description),
    },
    include: DEPOSIT_INCLUDE,
  });

  const [enriched] = await enrichDepositRecords([updated]);
  return enriched;
};

export const deleteDepositAccount = async (id: string) => {
  const existing = await prisma.depositAccount.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!existing) {
    throw new NotFoundError("Deposit account tidak ditemukan");
  }

  await prisma.depositAccount.delete({
    where: { id },
  });
};
