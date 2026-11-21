-- CreateTable
CREATE TABLE "matter_related_contacts" (
    "id" TEXT NOT NULL,
    "matterId" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "matter_related_contacts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "matter_related_contacts_matterId_contactId_key" ON "matter_related_contacts"("matterId", "contactId");

-- AddForeignKey
ALTER TABLE "matter_related_contacts" ADD CONSTRAINT "matter_related_contacts_matterId_fkey" FOREIGN KEY ("matterId") REFERENCES "matters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matter_related_contacts" ADD CONSTRAINT "matter_related_contacts_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;
