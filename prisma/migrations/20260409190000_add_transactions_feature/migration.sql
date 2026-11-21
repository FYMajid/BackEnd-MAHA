CREATE TYPE "InvoiceStatus" AS ENUM ('DRAFT', 'PENDING', 'PAID', 'OVERDUE');

CREATE TYPE "PaymentProofStatus" AS ENUM ('PENDING', 'VERIFIED');

CREATE TYPE "DepositActionType" AS ENUM ('ADD', 'REFUND');

CREATE TABLE "invoices" (
    "id" TEXT NOT NULL,
    "invoiceNo" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "matterId" TEXT NOT NULL,
    "invoiceDate" TIMESTAMP(3) NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "paymentTerms" TEXT,
    "description" TEXT,
    "notes" TEXT,
    "subtotal" INTEGER NOT NULL,
    "taxPercent" INTEGER NOT NULL DEFAULT 0,
    "taxAmount" INTEGER NOT NULL DEFAULT 0,
    "totalAmount" INTEGER NOT NULL,
    "status" "InvoiceStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "invoice_items" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "rate" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invoice_items_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "payment_proofs" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL,
    "amountPaid" INTEGER NOT NULL,
    "paymentMethod" TEXT,
    "referenceNo" TEXT,
    "notes" TEXT,
    "fileUrl" TEXT,
    "status" "PaymentProofStatus" NOT NULL DEFAULT 'PENDING',
    "verifiedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_proofs_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "deposit_accounts" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "matterId" TEXT,
    "amount" INTEGER NOT NULL DEFAULT 0,
    "refundedAmount" INTEGER NOT NULL DEFAULT 0,
    "lastTransactionDate" TIMESTAMP(3) NOT NULL,
    "paymentMethod" TEXT,
    "referenceNo" TEXT,
    "description" TEXT,
    "lastActionType" "DepositActionType" NOT NULL DEFAULT 'ADD',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "deposit_accounts_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "invoices_invoiceNo_key" ON "invoices"("invoiceNo");

CREATE INDEX "invoices_clientId_idx" ON "invoices"("clientId");
CREATE INDEX "invoices_matterId_idx" ON "invoices"("matterId");
CREATE INDEX "invoices_invoiceDate_idx" ON "invoices"("invoiceDate");
CREATE INDEX "invoices_status_idx" ON "invoices"("status");

CREATE INDEX "invoice_items_invoiceId_idx" ON "invoice_items"("invoiceId");

CREATE INDEX "payment_proofs_invoiceId_idx" ON "payment_proofs"("invoiceId");
CREATE INDEX "payment_proofs_status_idx" ON "payment_proofs"("status");
CREATE INDEX "payment_proofs_paymentDate_idx" ON "payment_proofs"("paymentDate");

CREATE INDEX "deposit_accounts_clientId_idx" ON "deposit_accounts"("clientId");
CREATE INDEX "deposit_accounts_matterId_idx" ON "deposit_accounts"("matterId");
CREATE INDEX "deposit_accounts_lastTransactionDate_idx" ON "deposit_accounts"("lastTransactionDate");

ALTER TABLE "invoices"
ADD CONSTRAINT "invoices_clientId_fkey"
FOREIGN KEY ("clientId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "invoices"
ADD CONSTRAINT "invoices_matterId_fkey"
FOREIGN KEY ("matterId") REFERENCES "matters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "invoice_items"
ADD CONSTRAINT "invoice_items_invoiceId_fkey"
FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "payment_proofs"
ADD CONSTRAINT "payment_proofs_invoiceId_fkey"
FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "deposit_accounts"
ADD CONSTRAINT "deposit_accounts_clientId_fkey"
FOREIGN KEY ("clientId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "deposit_accounts"
ADD CONSTRAINT "deposit_accounts_matterId_fkey"
FOREIGN KEY ("matterId") REFERENCES "matters"("id") ON DELETE SET NULL ON UPDATE CASCADE;
