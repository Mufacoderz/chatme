import { router } from "../trpc"
import { roomRouter } from "./room"
import { messageRouter } from "./message"
import { checklistItemRouter } from "./checklistItem"
import { pushRouter } from "./push"

export const appRouter = router({
  room: roomRouter,
  message: messageRouter,
  checklistItem: checklistItemRouter,
  push: pushRouter,
})

export type AppRouter = typeof appRouter
