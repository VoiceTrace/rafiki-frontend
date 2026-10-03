"use client"
import { getApps, initializeApp } from "firebase/app"
import { getMessaging, isSupported, onMessage, onRegistered, register, unregister } from "firebase/messaging"

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}
export const pushConfigured = Boolean(config.apiKey && config.projectId && config.messagingSenderId && config.appId && process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY)

const key = "rafiqi-push-installation"
async function bounded<T>(operation: Promise<T>, stage: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined
  try {
    return await Promise.race([operation, new Promise<never>((_, reject) => {
      timer = setTimeout(() => {
        console.warn(`Push setup timed out: ${stage}`)
        reject(new Error(`Push setup timed out: ${stage}`))
      }, 20000)
    })])
  } finally { clearTimeout(timer) }
}
function installationId() {
  let id = localStorage.getItem(key)
  if (!id) { id = crypto.randomUUID(); localStorage.setItem(key, id) }
  return id
}

async function messaging() {
  if (!pushConfigured) throw new Error("unavailable")
  if (!await isSupported()) throw new Error("unsupported")
  return getMessaging(getApps()[0] ?? initializeApp(config))
}

export async function enablePush(locale: string, requestPermission = true) {
  const instance = await bounded(messaging(), "browser support")
  const permission = requestPermission ? await bounded(Notification.requestPermission(), "notification permission") : Notification.permission
  if (permission !== "granted") throw new Error("denied")
  const worker = await bounded(navigator.serviceWorker.register("/firebase-messaging-sw.js"), "service worker registration")
  await bounded(navigator.serviceWorker.ready, "service worker activation")
  const fid = await new Promise<string>((resolve, reject) => {
    const timer = setTimeout(() => { stop(); reject(new Error("failed")) }, 20000)
    const stop = onRegistered(instance, value => { clearTimeout(timer); stop(); resolve(value) })
    register(instance, { vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY, serviceWorkerRegistration: worker })
      .catch(error => { clearTimeout(timer); stop(); reject(error) })
  })
  const response = await fetch(`/api/notifications/installations/${installationId()}`, {
    method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ fid, locale }),
  })
  if (!response.ok) throw new Error("failed")
  localStorage.setItem("rafiqi-push-enabled", "true")
  window.dispatchEvent(new Event("rafiqi-push-changed"))
}

export async function disablePush() {
  const id = localStorage.getItem(key)
  if (id) {
    const response = await fetch(`/api/notifications/installations/${id}`, { method: "DELETE" })
    if (!response.ok) throw new Error("failed")
  }
  if (pushConfigured && await isSupported()) await unregister(await messaging())
  localStorage.removeItem("rafiqi-push-enabled")
  window.dispatchEvent(new Event("rafiqi-push-changed"))
}

export async function preparePushLogout() {
  try { await disablePush() } catch {
    // Never prevent logout. Generic push text and server rebinding protect privacy.
    localStorage.removeItem("rafiqi-push-enabled")
  }
}

export async function listenPush(callback: (id: string) => void) {
  const instance = await messaging()
  return onMessage(instance, payload => {
    const id = payload.data?.notification_id
    if (id && /^[0-9a-f-]{36}$/.test(id)) callback(id)
  })
}
