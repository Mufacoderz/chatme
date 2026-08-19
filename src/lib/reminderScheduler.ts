import type { Message, PrismaClient } from "@prisma/client"
import { qstashClient, getAppUrl } from "./qstash"

// Reminder push diulang tiap interval ini selama reminder belum ditandai selesai.
// Nilai & env var sama persis dengan REMINDER_REPEAT_MINUTES yang tadinya dipakai
// src/app/api/cron/check-reminders/route.ts.
export const REPEAT_INTERVAL_MS = (Number(process.env.REMINDER_REPEAT_MINUTES) || 10) * 60 * 1000

export const REMINDER_TRIGGER_URL = `${getAppUrl()}/api/reminders/trigger`

type ReminderRow = Pick<Message, "id" | "remindAt" | "reminderVersion" | "isRemindDone">
type CancelableRow = Pick<Message, "id" | "remindQstashId">

// Batalkan job QStash yang lagi nunggu buat reminder ini. Best-effort — kalau job udah
// kepake / expired / gak ketemu di sisi QStash, kegagalannya diabaikan aja. Perlindungan
// utama terhadap job basi tetap dari reminderVersion check di endpoint trigger; fungsi ini
// cuma optimisasi supaya gak ada job nganggur numpuk di QStash.
export async function cancelReminderJob(prisma: PrismaClient, message: CancelableRow) {
  if (!message.remindQstashId) return
  try {
    await qstashClient.messages.cancel(message.remindQstashId)
  } catch {
    // aman diabaikan
  }
  await prisma.message.updateMany({
    where: { id: message.id, remindQstashId: message.remindQstashId },
    data: { remindQstashId: null },
  })
}

async function scheduleReminderJob(prisma: PrismaClient, message: ReminderRow) {
  if (!message.remindAt) return
  const delaySeconds = Math.max(0, Math.floor((message.remindAt.getTime() - Date.now()) / 1000))
  const res = await qstashClient.publishJSON({
    url: REMINDER_TRIGGER_URL,
    body: { messageId: message.id, version: message.reminderVersion },
    delay: delaySeconds,
  })
  await prisma.message.update({
    where: { id: message.id },
    data: { remindQstashId: res.messageId },
  })
}

// Dipanggil tiap kali remindAt sebuah reminder berubah (set reminder baru / snooze):
// batalkan job lama (kalau ada) lalu jadwalkan job baru sesuai remindAt & reminderVersion
// terkini. Kalau remindAt-nya null (reminder dimatikan) atau reminder udah ditandai
// selesai, gak ada job baru yang dijadwalkan.
//
// Kegagalan publish ke QStash sengaja gak dilempar ke caller — reminder tetap tersimpan
// di database (source of truth), cuma job pengingatnya belum sempat terjadwal.
export async function rescheduleReminderJob(
  prisma: PrismaClient,
  message: ReminderRow & CancelableRow
) {
  await cancelReminderJob(prisma, message)
  if (!message.remindAt || message.isRemindDone) return
  try {
    await scheduleReminderJob(prisma, message)
  } catch (err) {
    console.error("[reminderScheduler] gagal menjadwalkan reminder", message.id, err)
  }
}