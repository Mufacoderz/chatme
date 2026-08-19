import { z } from "zod"
import { verifySignatureAppRouter } from "@upstash/qstash/nextjs"
import { prisma } from "@/lib/prisma"
import { sendPushToUser } from "@/lib/webPush"
import { qstashClient } from "@/lib/qstash"
import { REPEAT_INTERVAL_MS, REMINDER_TRIGGER_URL } from "@/lib/reminderScheduler"

const payloadSchema = z.object({
  messageId: z.string(),
  version: z.number(),
})

// Jadwalkan cek berikutnya buat reminder yang sama (repeat notification), delay tetap
// REPEAT_INTERVAL_MS dari sekarang — persis semantik REMINDER_REPEAT_MINUTES di cron lama.
async function scheduleNextRepeat(messageId: string, version: number) {
  try {
    const res = await qstashClient.publishJSON({
      url: REMINDER_TRIGGER_URL,
      body: { messageId, version },
      delay: Math.ceil(REPEAT_INTERVAL_MS / 1000),
    })
    await prisma.message.update({
      where: { id: messageId },
      data: { remindQstashId: res.messageId },
    })
  } catch (err) {
    console.error("[reminders/trigger] gagal menjadwalkan repeat berikutnya", messageId, err)
  }
}

async function handler(req: Request) {
  const body = payloadSchema.parse(await req.json())
  const now = new Date()
  const cutoff = new Date(now.getTime() - REPEAT_INTERVAL_MS)

  // Klaim atomik: cuma eksekusi yang berhasil nge-update baris ini yang lanjut ngirim
  // push. Ini yang bikin endpoint idempotent terhadap QStash retry / concurrent execution
  // (dua request bisa masuk bersamaan), dan otomatis nge-skip job basi — reminder yang
  // udah di-reschedule (reminderVersion beda), ditandai selesai, atau dihapus (row gak
  // ke-update sama sekali) gak akan lolos claim ini.
  const claim = await prisma.message.updateMany({
    where: {
      id: body.messageId,
      isBot: false,
      isRemindDone: false,
      reminderVersion: body.version,
      remindAt: { lte: now },
      OR: [{ remindNotifiedAt: null }, { remindNotifiedAt: { lte: cutoff } }],
    },
    data: { remindNotifiedAt: now },
  })

  if (claim.count === 0) {
    return Response.json({ skipped: true })
  }

  const reminder = await prisma.message.findUniqueOrThrow({ where: { id: body.messageId } })

  // Jadwalkan cek berikutnya DULUAN, sebelum kirim push — supaya kalau pengiriman push
  // gagal (mis. layanan push lagi down), reminder tetap dapat kesempatan coba lagi di
  // siklus berikutnya, bukan diam selamanya.
  await scheduleNextRepeat(reminder.id, reminder.reminderVersion)

  // Bikin bot bubble kalau belum ada. Unique constraint di sourceMessageId + skipDuplicates
  // mencegah duplikat kalau somehow job ini kepanggil lebih dari sekali.
  await prisma.message.createMany({
    data: [
      {
        text: reminder.text,
        isBot: true,
        sourceMessageId: reminder.id,
        roomId: reminder.roomId,
        userId: reminder.userId,
      },
    ],
    skipDuplicates: true,
  })

  await sendPushToUser(prisma, reminder.userId, {
    id: reminder.id,
    title: "Pengingat Chatme",
    body: reminder.text || "Ada pengingat yang perlu kamu cek.",
    url: `/room/${reminder.roomId}`,
    tag: `chatme-reminder-${reminder.id}`,
  })

  return Response.json({ ok: true })
}

// Sama seperti /api/cron/check-reminders: request wajib ditandatangani QStash.
export const POST = verifySignatureAppRouter(handler)