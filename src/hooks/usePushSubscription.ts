"use client"

import { trpc } from "@/lib/trpc"

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")
  const rawData = atob(base64)
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)))
}

export function usePushSubscription() {
  const subscribe = trpc.push.subscribe.useMutation()

  async function enablePush() {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return false

    const permission = await Notification.requestPermission()
    if (permission !== "granted") return false

    const registration = await navigator.serviceWorker.ready
    const existing = await registration.pushManager.getSubscription()
    const subscription =
      existing ??
      (await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!),
      }))

    await subscribe.mutateAsync({ subscription: subscription.toJSON() as never })
    return true
  }

  return { enablePush }
}
