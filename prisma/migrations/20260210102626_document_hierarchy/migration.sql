-- AlterTable
ALTER TABLE "documents" ADD COLUMN     "fileSize" INTEGER,
ADD COLUMN     "parentId" TEXT;

-- CreateIndex
CREATE INDEX "documents_parentId_idx" ON "documents"("parentId");

-- CreateIndex
CREATE INDEX "documents_parentId_name_idx" ON "documents"("parentId", "name");

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "documents"("id") ON DELETE SET NULL ON UPDATE CASCADE;
