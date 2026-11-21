-- CreateEnum
CREATE TYPE "MatterStatus" AS ENUM ('DONE', 'IN_PROGRESS', 'PENDING');

-- CreateTable
CREATE TABLE "matters" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "responsibleAttorneyId" TEXT NOT NULL,
    "members" TEXT,
    "caseArea" TEXT NOT NULL,
    "caseType" TEXT NOT NULL,
    "disputeResolution" TEXT NOT NULL,
    "description" TEXT,
    "address" TEXT,
    "status" "MatterStatus" NOT NULL DEFAULT 'PENDING',
    "startDate" TIMESTAMP(3),
    "pendingDate" TIMESTAMP(3),
    "closeDate" TIMESTAMP(3),
    "paymentMethod" TEXT,
    "additionalInfo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "matters_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_matterId_fkey" FOREIGN KEY ("matterId") REFERENCES "matters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matters" ADD CONSTRAINT "matters_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Contact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matters" ADD CONSTRAINT "matters_responsibleAttorneyId_fkey" FOREIGN KEY ("responsibleAttorneyId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
