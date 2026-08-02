import { prisma } from "@/lib/prisma"
import { sendPushToUser } from "@/lib/webPush"
import { verifySignatureAppRouter } from "@upstash/qstash/nextjs"

async function handler() {
  const pendingReminders = await prisma.message.findMany({
    where: {
      isBot: false,
      isRemindDone: false,
      remindAt: { lte: new Date() },
      reminders: { none: {} },
    },
    select: { id: true, text: true, userId: true, roomId: true },
  })

  if (pendingReminders.length === 0) {
    return Response.json({ processed: 0 })
  }

  await prisma.message.createMany({
    data: pendingReminders.map((r) => ({
      text: r.text,
      isBot: true,
      sourceMessageId: r.id,
      roomId: r.roomId,
      userId: r.userId,
    })),
    skipDuplicates: true,
  })

  for (const reminder of pendingReminders) {
    await sendPushToUser(prisma, reminder.userId, {
      title: "Pengingat Chatme",
      body: reminder.text || "Ada pengingat yang perlu kamu cek.",
      url: `/room/${reminder.roomId}`,
      tag: `chatme-reminder-${reminder.id}`,
    })
  }

  return Response.json({ processed: pendingReminders.length })
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
