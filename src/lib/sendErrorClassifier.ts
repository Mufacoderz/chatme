import { TRPCClientError } from "@trpc/client"

export type SendErrorKind = "offline" | "rate-limit" | "other"

export function classifySendError(err: unknown): SendErrorKind {
  if (typeof navigator !== "undefined" && !navigator.onLine) return "offline"

  if (err instanceof TRPCClientError) {
    if (err.data?.code === "TOO_MANY_REQUESTS") return "rate-limit"
    if (!err.data?.code) return "offline"
  }

  return "other"
}
