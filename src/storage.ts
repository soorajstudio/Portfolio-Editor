import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js'
import type { Content } from './types'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

/** true when Supabase env vars are present; otherwise the app runs in "local mode". */
export const hasSupabase = Boolean(url && key)
const sb: SupabaseClient | null = hasSupabase ? createClient(url!, key!) : null

const LOCAL_KEY = 'portfolio-content-v1'
const ROW_ID = 'main'
const BUCKET = 'portfolio-images'

/* ---------- content ---------- */

export async function loadContent(): Promise<Content | null> {
  if (sb) {
    const { data, error } = await sb.from('portfolio').select('content').eq('id', ROW_ID).maybeSingle()
    if (error) {
      console.warn('Could not load content from Supabase:', error.message)
      return null
    }
    return (data?.content as Content) ?? null
  }
  try {
    const raw = localStorage.getItem(LOCAL_KEY)
    return raw ? (JSON.parse(raw) as Content) : null
  } catch {
    return null
  }
}

export async function saveContent(content: Content): Promise<void> {
  if (sb) {
    const { error } = await sb
      .from('portfolio')
      .upsert({ id: ROW_ID, content, updated_at: new Date().toISOString() })
    if (error) throw new Error(error.message)
    return
  }
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(content))
  } catch {
    throw new Error('Browser storage is full. Use smaller images, or connect Supabase.')
  }
}

export function clearLocal() {
  localStorage.removeItem(LOCAL_KEY)
}

/* ---------- images ---------- */

async function shrink(file: File, max = 1600): Promise<Blob> {
  if (file.type === 'image/svg+xml' || file.type === 'image/gif') return file
  const bmp = await createImageBitmap(file)
  const scale = Math.min(1, max / Math.max(bmp.width, bmp.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bmp.width * scale)
  canvas.height = Math.round(bmp.height * scale)
  canvas.getContext('2d')!.drawImage(bmp, 0, 0, canvas.width, canvas.height)
  const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/webp', 0.85))
  return blob ?? file
}

const toDataUrl = (b: Blob) =>
  new Promise<string>((res, rej) => {
    const r = new FileReader()
    r.onload = () => res(r.result as string)
    r.onerror = () => rej(r.error)
    r.readAsDataURL(b)
  })

/** Uploads an image and returns the URL to store in the content. */
export async function uploadImage(file: File): Promise<string> {
  const blob = await shrink(file)
  if (!sb) return toDataUrl(blob) // local mode: embed in the saved content
  const ext = (blob.type.split('/')[1] || 'png').replace('+xml', '')
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  const { error } = await sb.storage.from(BUCKET).upload(path, blob, { contentType: blob.type, upsert: false })
  if (error) throw new Error(error.message)
  return sb.storage.from(BUCKET).getPublicUrl(path).data.publicUrl
}

/* ---------- auth ---------- */

export async function getUser(): Promise<User | null> {
  if (!sb) return null
  const { data } = await sb.auth.getSession()
  return data.session?.user ?? null
}

export function onAuth(cb: (u: User | null) => void): () => void {
  if (!sb) return () => {}
  const { data } = sb.auth.onAuthStateChange((_e, session) => cb(session?.user ?? null))
  return () => data.subscription.unsubscribe()
}

export async function signIn(email: string, password: string): Promise<void> {
  if (!sb) return
  const { error } = await sb.auth.signInWithPassword({ email, password })
  if (error) throw new Error(error.message)
}

export async function signOut(): Promise<void> {
  if (sb) await sb.auth.signOut()
}
