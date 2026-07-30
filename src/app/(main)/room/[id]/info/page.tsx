import { auth } from "@/auth"
import { redirect } from "next/navigation"
import RoomInfoView from "@/components/chat/RoomInfoView"

type Props = {
  params: Promise<{ id: string }>
}

export default async function RoomInfoPage({ params }: Props) {
  const { id } = await params
  const session = await auth()
  if (!session?.user) redirect("/login")

  return <RoomInfoView roomId={id} />
}
