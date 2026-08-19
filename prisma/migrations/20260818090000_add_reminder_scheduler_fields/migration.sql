-- AlterTable
-- reminderVersion: dinaikkan tiap kali remindAt sebuah reminder berubah (set/snooze).
--   Dipakai endpoint /api/reminders/trigger buat nolak job QStash basi (mis. reminder
--   udah di-reschedule sejak job itu dijadwalkan).
-- remindQstashId: id message QStash yang lagi mewakili job pending buat reminder ini,
--   dipakai buat best-effort cancel pas reminder di-reschedule/ditandai selesai/dihapus.
ALTER TABLE "messages" ADD COLUMN     "reminderVersion" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "remindQstashId" TEXT;