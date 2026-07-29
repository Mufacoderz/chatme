-- AlterTable: change default from emoji to image filename
ALTER TABLE "rooms" ALTER COLUMN "icon" SET DEFAULT '1.png';

-- Backfill: set existing icons that aren't valid image filenames to default
UPDATE "rooms" SET "icon" = '1.png' WHERE "icon" !~ '^([1-9]|1[0-6])\.png$';

-- CreateIndex
CREATE INDEX IF NOT EXISTS "messages_remindAt_idx" ON "messages"("remindAt");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "rooms_userId_idx" ON "rooms"("userId");
