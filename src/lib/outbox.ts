import type { QueryClient } from "@tanstack/react-query"

export type OutboxStatus = "pending" | "sending" | "failed"

export type OutboxItem = {
  tempId: string
  roomId: string
  text: string
  type: "TEXT"
  createdAt: string
  status: OutboxStatus
  retryCount: number
  nextRetryAt: string | null
  lastError: string | null
}

export const OUTBOX_KEY = ["outbox"] as const

export const MAX_RATE_LIMIT_RETRIES = 5
export const RATE_LIMIT_BACKOFF_BASE_MS = 5_000

export function addOutboxItem(queryClient: QueryClient, item: OutboxItem) {
  queryClient.setQueryData<OutboxItem[]>(OUTBOX_KEY, (old = []) => [...old, item])
}

export function updateOutboxItem(
  queryClient: QueryClient,
  tempId: string,
  patch: Partial<OutboxItem>
) {
  queryClient.setQueryData<OutboxItem[]>(OUTBOX_KEY, (old = []) =>
    old.map((it) => (it.tempId === tempId ? { ...it, ...patch } : it))
  )
}

export function removeOutboxItem(queryClient: QueryClient, tempId: string) {
  queryClient.setQueryData<OutboxItem[]>(OUTBOX_KEY, (old = []) =>
    old.filter((it) => it.tempId !== tempId)
  )
}

export function getOutboxItems(queryClient: QueryClient): OutboxItem[] {
  return queryClient.getQueryData<OutboxItem[]>(OUTBOX_KEY) ?? []
}
