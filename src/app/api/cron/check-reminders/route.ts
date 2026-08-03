import { prisma } from "@/lib/prisma"
import { sendPushToUser } from "@/lib/webPush"
import { verifySignatureAppRouter } from "@upstash/qstash/nextjs"

// Notif diulang tiap interval ini selama reminder belum ditandai selesai.
const REPEAT_INTERVAL_MS = (Number(process.env.REMINDER_REPEAT_MINUTES) || 10) * 60 * 1000

async function handler() {
  const now = new Date()

  // Bubble sistem (chat + card) dibuat cukup sekali — kunci via `reminders: { none: {} }`.
  const newDue = await prisma.message.findMany({
    where: {
      isBot: false,
      isRemindDone: false,
      remindAt: { lte: now },
      reminders: { none: {} },
    },
    select: { id: true, text: true, userId: true, roomId: true },
  })

  if (newDue.length > 0) {
    await prisma.message.createMany({
      data: newDue.map((r) => ({
        text: r.text,
        isBot: true,
        sourceMessageId: r.id,
        roomId: r.roomId,
        userId: r.userId,
      })),
      skipDuplicates: true,
    })
  }

  // Push diulang tiap interval selama belum ditandai selesai.
  const dueForPush = await prisma.message.findMany({
    where: {
      isBot: false,
      isRemindDone: false,
      remindAt: { lte: now },
      OR: [
        { remindNotifiedAt: null },
        { remindNotifiedAt: { lte: new Date(now.getTime() - REPEAT_INTERVAL_MS) } },
      ],
    },
    select: { id: true, text: true, userId: true, roomId: true },
  })

  for (const reminder of dueForPush) {
    await sendPushToUser(prisma, reminder.userId, {
      id: reminder.id,
      title: "Pengingat Chatme",
      body: reminder.text || "Ada pengingat yang perlu kamu cek.",
      url: `/room/${reminder.roomId}`,
      tag: `chatme-reminder-${reminder.id}`,
    })
    await prisma.message.update({
      where: { id: reminder.id },
      data: { remindNotifiedAt: now },
    })
  }

  return Response.json({ processed: dueForPush.length, bubbles: newDue.length })
}

// GET manual/testing tetap pakai CRON_SECRET. POST dari QStash schedule
// diverifikasi signature-nya via verifySignatureAppRouter.
export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 })
  }
  return handler()
}

export const POST = verifySignatureAppRouter(handler)
