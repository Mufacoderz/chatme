import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { rescheduleReminderJob } from "@/lib/reminderScheduler"

const SNOOZE_MINUTES = Number(process.env.REMINDER_SNOOZE_MINUTES) || 15

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 })
  }

  const { id } = await params
  const remindAt = new Date(Date.now() + SNOOZE_MINUTES * 60 * 1000)

  const result = await prisma.message.updateMany({
    where: { id, userId: session.user.id },
    data: {
      remindAt,
      isRemindDone: false,
      remindNotifiedAt: null,
      // Naikkan versi biar job QStash lama (kalau ada) otomatis basi buat trigger endpoint.
      reminderVersion: { increment: 1 },
    },
  })

  if (result.count === 0) {
    return new Response("Not found", { status: 404 })
  }

  const updated = await prisma.message.findUniqueOrThrow({ where: { id } })
  await rescheduleReminderJob(prisma, updated)

  return Response.json({ success: true, remindAt })
}