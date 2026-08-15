"use client"

import { useEffect, useRef } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { trpc } from "@/lib/trpc"
import { OUTBOX_KEY, type OutboxItem, updateOutboxItem } from "@/lib/outbox"
import { useOutboxQuery, attemptSendOutboxItem } from "@/hooks/useMessages"

const POLL_INTERVAL_MS = 10_000

export default function OutboxProcessor() {
  const queryClient = useQueryClient()
  const utils = trpc.useUtils()
  const { data: outbox = [] } = useOutboxQuery()
  const processingRef = useRef(false)

  useEffect(() => {
    outbox.forEach((item) => {
      if (item.status === "sending") updateOutboxItem(queryClient, item.tempId, { status: "pending" })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function drain() {
    if (processingRef.current) return
    if (typeof navigator !== "undefined" && !navigator.onLine) return
    processingRef.current = true
    try {
      const current = queryClient.getQueryData<OutboxItem[]>(OUTBOX_KEY) ?? []
      const now = Date.now()
      const next = current.find(
        (it) => it.status === "pending" && (!it.nextRetryAt || new Date(it.nextRetryAt).getTime() <= now)
      )
      if (next) {
        await attemptSendOutboxItem(utils, queryClient, next)
        await drain()
      }
    } finally {
      processingRef.current = false
    }
  }

  useEffect(() => {
    drain()
    window.addEventListener("online", drain)
    const interval = window.setInterval(drain, POLL_INTERVAL_MS)
    return () => {
      window.removeEventListener("online", drain)
      window.clearInterval(interval)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outbox])

  return null
}
