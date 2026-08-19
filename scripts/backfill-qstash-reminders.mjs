// Jadwalkan QStash delayed job untuk semua reminder yang SUDAH aktif di database.
// WAJIB dijalankan setelah deploy, karena cron */5 lama sudah dihentikan duluan —
// tanpa script ini, reminder yang sudah aktif sebelum migrasi gak akan pernah
// diproses (gak ada lagi cron yang ngecek, dan job QStash baru cuma dibuat kalau
// user nyentuh reminder itu lagi lewat setReminder/snooze).
//
// Kalau remindAt reminder itu udah lewat waktunya, job dijadwalkan dengan delay 0
// (nembak ~seketika) — jadi ini juga berfungsi "catch up" buat reminder yang
// telat gara-gara cron sempat mati.
//
//   node scripts/backfill-qstash-reminders.mjs

import { PrismaClient } from "@prisma/client"
import { Client } from "@upstash/qstash"

process.loadEnvFile(".env")

const prisma = new PrismaClient()

const qstashToken = process.env.US_EAST_1_QSTASH_TOKEN || process.env.QSTASH_TOKEN
const qstashUrl = process.env.US_EAST_1_QSTASH_URL || process.env.QSTASH_URL
const appUrl = process.env.APP_URL || "https://chatme-jet.vercel.app"
const triggerUrl = `${appUrl}/api/reminders/trigger`

if (!qstashToken) {
  console.error("QStash token belum di-set (US_EAST_1_QSTASH_TOKEN / QSTASH_TOKEN)")
  process.exit(1)
}

const qstash = new Client({ token: qstashToken, ...(qstashUrl ? { baseUrl: qstashUrl } : {}) })

const activeReminders = await prisma.message.findMany({
  where: { isBot: false, isRemindDone: false, remindAt: { not: null } },
  select: { id: true, remindAt: true, reminderVersion: true },
})

console.log(`Ketemu ${activeReminders.length} reminder aktif buat di-backfill ke ${triggerUrl}`)

let success = 0
for (const reminder of activeReminders) {
  const delaySeconds = Math.max(0, Math.floor((reminder.remindAt.getTime() - Date.now()) / 1000))
  try {
    const res = await qstash.publishJSON({
      url: triggerUrl,
      body: { messageId: reminder.id, version: reminder.reminderVersion },
      delay: delaySeconds,
    })
    await prisma.message.update({
      where: { id: reminder.id },
      data: { remindQstashId: res.messageId },
    })
    success++
  } catch (err) {
    console.error("Gagal backfill reminder", reminder.id, err)
  }
}

console.log(`Selesai. ${success}/${activeReminders.length} reminder berhasil dijadwalkan ulang lewat QStash.`)

await prisma.$disconnect()