-- CreateEnum
CREATE TYPE "ClientStatus" AS ENUM ('CLIENT', 'NON_CLIENT');

-- CreateTable
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL,
    "isClient" "ClientStatus" NOT NULL DEFAULT 'CLIENT',
    "contactType" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT,
    "email" TEXT,
    "phoneNumber" TEXT,
    "address" TEXT,
    "additionalInfo" TEXT,
    "creator" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PersonalDetail" (
    "id" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "citizenship" TEXT,
    "identificationNo" TEXT,
    "position" TEXT,
    "gender" TEXT,
    "birthDate" TIMESTAMP(3),
    "religion" TEXT,

    CONSTRAINT "PersonalDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusinessDetail" (
    "id" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "businessType" TEXT,
    "taxCode" TEXT,
    "commissioners" TEXT,
    "directors" TEXT,
    "shareholders" TEXT,
    "lawyers" TEXT,

    CONSTRAINT "BusinessDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationDetail" (
    "id" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "structureType" TEXT,
    "taxCode" TEXT,
    "maintainers" TEXT,
    "mentors" TEXT,
    "supervisors" TEXT,
    "members" TEXT,
    "lawyers" TEXT,

    CONSTRAINT "OrganizationDetail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PersonalDetail_contactId_key" ON "PersonalDetail"("contactId");

-- CreateIndex
CREATE UNIQUE INDEX "BusinessDetail_contactId_key" ON "BusinessDetail"("contactId");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationDetail_contactId_key" ON "OrganizationDetail"("contactId");

-- AddForeignKey
ALTER TABLE "PersonalDetail" ADD CONSTRAINT "PersonalDetail_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessDetail" ADD CONSTRAINT "BusinessDetail_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationDetail" ADD CONSTRAINT "OrganizationDetail_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;
