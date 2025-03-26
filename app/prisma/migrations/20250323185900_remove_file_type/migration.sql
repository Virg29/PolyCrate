/*
  Warnings:

  - You are about to drop the column `file_type` on the `ProjectFile` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "ProjectFile_file_type_idx";

-- AlterTable
ALTER TABLE "ProjectFile" DROP COLUMN "file_type";

-- CreateIndex
CREATE INDEX "ProjectFile_mime_type_idx" ON "ProjectFile"("mime_type");
