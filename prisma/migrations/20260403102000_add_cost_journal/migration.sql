c-- CreateEnum
CREATE TYPE "CostJournalEntryType" AS ENUM ('EXPENSE', 'TIME');

-- CreateEnum
CREATE TYPE "CostJournalBillingType" AS ENUM ('BILLABLE', 'NON_BILLABLE');

-- CreateTable
CREATE TABLE "cost_journals" (
    "id" TEXT NOT NULL,
    "matterId" TEXT NOT NULL,
    "entryType" "CostJournalEntryType" NOT NULL,
    "billingType" "CostJournalBillingType" NOT NULL DEFAULT 'BILLABLE',
    "category" TEXT,
    "entryDate" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "quantity" INTEGER,
    "unitCost" INTEGER,
    "durationMinutes" INTEGER,
    "hourlyRate" INTEGER,
    "totalCost" INTEGER NOT NULL,
    "attachmentUrl" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cost_journals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "cost_journals_matterId_idx" ON "cost_journals"("matterId");

-- CreateIndex
CREATE INDEX "cost_journals_entryType_idx" ON "cost_journals"("entryType");

-- CreateIndex
CREATE INDEX "cost_journals_billingType_idx" ON "cost_journals"("billingType");

-- CreateIndex
CREATE INDEX "cost_journals_entryDate_idx" ON "cost_journals"("entryDate");

-- AddForeignKey
ALTER TABLE "cost_journals" ADD CONSTRAINT "cost_journals_matterId_fkey" FOREIGN KEY ("matterId") REFERENCES "matters"("id") ON DELETE CASCADE ON UPDATE CASCADE;
