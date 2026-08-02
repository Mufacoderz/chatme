// Setup jadwal QStash untuk cron check-reminders.
// Jalankan sekali setelah deploy: npm run qstash:setup
// Butuh env: US_EAST_1_QSTASH_URL, US_EAST_1_QSTASH_TOKEN (dari .env)

import { Client } from "@upstash/qstash"

process.loadEnvFile(".env")

const qstashUrl = process.env.US_EAST_1_QSTASH_URL
const qstashToken = process.env.US_EAST_1_QSTASH_TOKEN

if (!qstashUrl || !qstashToken) {
  console.error("US_EAST_1_QSTASH_URL / US_EAST_1_QSTASH_TOKEN belum di-set di .env")
  process.exit(1)
}

const destination = "https://chatme-jet.vercel.app/api/cron/check-reminders"
const cron = "*/5 * * * *"

const client = new Client({ token: qstashToken, baseUrl: qstashUrl })

try {
  // Hapus schedule lama yang nunjuk ke destination yang sama biar nggak dobel.
  const schedules = await client.schedules.list()
  for (const s of schedules) {
    if (s.destination === destination) {
      await client.schedules.delete(s.scheduleId)
      console.log("Hapus schedule lama:", s.scheduleId)
    }
  }

  const result = await client.schedules.create({ destination, cron, retries: 3 })
  console.log("Jadwal QStash siap:", cron, "->", destination)
  console.log("Schedule ID:", result.scheduleId)
} catch (err) {
  console.error("Gagal setup jadwal QStash:", err)
  process.exit(1)
}
