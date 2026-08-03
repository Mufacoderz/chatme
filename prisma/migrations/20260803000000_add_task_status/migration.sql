-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('PENDING', 'DONE', 'NOT_DONE');

-- AlterTable: tambah kolom baru dulu (dengan default PENDING)
ALTER TABLE "messages" ADD COLUMN     "taskStatus" "TaskStatus" NOT NULL DEFAULT 'PENDING';

-- Backfill data lama SEBELUM kolom isDone dihapus (preserve status DONE)
UPDATE "messages" SET "taskStatus" = 'DONE' WHERE "isDone" = true;

-- Baru hapus kolom lama
ALTER TABLE "messages" DROP COLUMN "isDone";