import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { cancelReminderJob } from "@/lib/reminderScheduler"

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 })
  }

  const { id } = await params

  const existing = await prisma.message.findFirst({
    where: { id, userId: session.user.id },
    select: { id: true, remindQstashId: true },
  })
  if (!existing) {
    return new Response("Not found", { status: 404 })
  }

  await prisma.message.update({
    where: { id: existing.id },
    data: { isRemindDone: true, taskStatus: "DONE" },
  })
  await cancelReminderJob(prisma, existing)

  // Sinkronkan bubble bot (card pengingat) di chat — biar ikut hilang,
  // sama persis kayak kalau "Selesai" ditekan langsung dari card-nya.
  await prisma.message.updateMany({
    where: { sourceMessageId: existing.id, userId: session.user.id },
    data: { isRemindDone: true },
  })

  return Response.json({ success: true })
}