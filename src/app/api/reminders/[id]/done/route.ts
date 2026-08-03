import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 })
  }

  const { id } = await params

  const result = await prisma.message.updateMany({
    where: { id, userId: session.user.id },
    data: { isRemindDone: true, taskStatus: "DONE" },
  })

  if (result.count === 0) {
    return new Response("Not found", { status: 404 })
  }

  return Response.json({ success: true })
}