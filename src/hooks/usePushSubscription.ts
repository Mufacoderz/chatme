"use client"

import { trpc } from "@/lib/trpc"

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")
  const rawData = atob(base64)
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)))
}

function sameKey(a: ArrayBuffer | null, b: Uint8Array) {
  if (!a) return false
  const arrA = new Uint8Array(a)
  return arrA.length === b.length && arrA.every((byte, i) => byte === b[i])
}

export function usePushSubscription() {
  const subscribe = trpc.push.subscribe.useMutation()

  async function enablePush() {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return false

    const permission = await Notification.requestPermission()
    if (permission !== "granted") return false

    const registration = await navigator.serviceWorker.ready
    const currentKey = urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!)

    const existing = await registration.pushManager.getSubscription()
    // Subscription lama cuma valid dipake ulang kalau applicationServerKey-nya sama persis
    // dengan VAPID public key yang aktif sekarang. Kalau beda (VAPID key pernah diganti di
    // env), subscription lama itu gak akan PERNAH bisa dipake server buat ngirim push lagi
    // (bakal selalu gagal di web-push dengan error semacam VapidPkHashMismatch) — walaupun
    // dari sisi UI kelihatan "berhasil subscribe". Harus unsubscribe dulu & subscribe ulang
    // biar dapet subscription yang match key yang aktif sekarang.
    if (existing && !sameKey(existing.options.applicationServerKey, currentKey)) {
      await existing.unsubscribe()
    }

    const subscription =
      (await registration.pushManager.getSubscription()) ??
      (await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: currentKey,
      }))

    await subscribe.mutateAsync({ subscription: subscription.toJSON() as never })
    return true
  }

  return { enablePush }
}