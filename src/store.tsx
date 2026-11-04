import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import type { Content, Section } from './types'
import { defaultContent } from './defaultContent'
import * as storage from './storage'

type Status = 'idle' | 'saving' | 'saved' | 'error'

interface Store {
  content: Content
  loaded: boolean
  /** true when the owner is logged in AND in edit (not preview) mode */
  editMode: boolean
  isAdmin: boolean
  editing: boolean
  setEditing: (v: boolean) => void
  status: Status
  error: string
  update: (fn: (c: Content) => void) => void
  replaceAll: (c: Content) => void
  undo: () => void
  canUndo: boolean
  moveSection: (id: string, dir: -1 | 1) => void
  deleteSection: (id: string) => void
  addSection: (s: Section) => void
  uploadImage: (f: File) => Promise<string>
  requestAdmin: () => void
  logout: () => Promise<void>
  showLogin: boolean
  closeLogin: () => void
  login: (email: string, password: string) => Promise<void>
  resetToDefault: () => void
  localMode: boolean
}

const Ctx = createContext<Store>(null as unknown as Store)
export const useStore = () => useContext(Ctx)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<Content>(defaultContent)
  const contentRef = useRef(content)
  const history = useRef<Content[]>([])
  const dirty = useRef(false)
  const [historyLen, setHistoryLen] = useState(0)

  const [loaded, setLoaded] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [editing, setEditing] = useState(true)
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')
  const [showLogin, setShowLogin] = useState(false)

  const apply = (c: Content) => {
    contentRef.current = c
    setContent(c)
    dirty.current = true
  }

  // initial load + auth restore
  useEffect(() => {
    let alive = true
    storage
      .loadContent()
      .then((c) => {
        if (alive && c && Array.isArray(c.sections)) {
          contentRef.current = c
          setContent(c)
        }
      })
      .finally(() => alive && setLoaded(true))
    storage.getUser().then((u) => alive && setIsAdmin(!!u))
    const off = storage.onAuth((u) => setIsAdmin(!!u))
    return () => {
      alive = false
      off()
    }
  }, [])

  // debounced autosave
  useEffect(() => {
    if (!dirty.current) return
    setStatus('saving')
    const t = setTimeout(async () => {
      try {
        await storage.saveContent(content)
        setStatus('saved')
        setError('')
      } catch (e) {
        setStatus('error')
        setError(e instanceof Error ? e.message : String(e))
      }
    }, 700)
    return () => clearTimeout(t)
  }, [content])

  const pushHistory = () => {
    history.current.push(contentRef.current)
    if (history.current.length > 50) history.current.shift()
    setHistoryLen(history.current.length)
  }

  const update = useCallback((fn: (c: Content) => void) => {
    pushHistory()
    const next = structuredClone(contentRef.current)
    fn(next)
    apply(next)
  }, [])

  const replaceAll = useCallback((c: Content) => {
    pushHistory()
    apply(c)
  }, [])

  const undo = useCallback(() => {
    const prev = history.current.pop()
    setHistoryLen(history.current.length)
    if (prev) apply(prev)
  }, [])

  const moveSection = useCallback(
    (id: string, dir: -1 | 1) =>
      update((c) => {
        const i = c.sections.findIndex((s) => s.id === id)
        const j = i + dir
        if (i < 0 || j < 0 || j >= c.sections.length) return
        ;[c.sections[i], c.sections[j]] = [c.sections[j], c.sections[i]]
      }),
    [update],
  )

  const deleteSection = useCallback(
    (id: string) =>
      update((c) => {
        c.sections = c.sections.filter((s) => s.id !== id)
      }),
    [update],
  )

  const addSection = useCallback(
    (s: Section) =>
      update((c) => {
        // keep the contact section last if present
        const ci = c.sections.findIndex((x) => x.type === 'contact')
        if (ci >= 0) c.sections.splice(ci, 0, s)
        else c.sections.push(s)
      }),
    [update],
  )

  const requestAdmin = useCallback(() => {
    if (!storage.hasSupabase) {
      setIsAdmin(true)
      setEditing(true)
    } else if (isAdmin) setEditing(true)
    else setShowLogin(true)
  }, [isAdmin])

  const login = useCallback(async (email: string, password: string) => {
    await storage.signIn(email, password)
    setEditing(true)
    setShowLogin(false)
  }, [])

  const logout = useCallback(async () => {
    await storage.signOut()
    setIsAdmin(false)
  }, [])

  const resetToDefault = useCallback(() => {
    pushHistory()
    apply(structuredClone(defaultContent))
  }, [])

  const value = useMemo<Store>(
    () => ({
      content,
      loaded,
      editMode: isAdmin && editing,
      isAdmin,
      editing,
      setEditing,
      status,
      error,
      update,
      replaceAll,
      undo,
      canUndo: historyLen > 0,
      moveSection,
      deleteSection,
      addSection,
      uploadImage: storage.uploadImage,
      requestAdmin,
      logout,
      showLogin,
      closeLogin: () => setShowLogin(false),
      login,
      resetToDefault,
      localMode: !storage.hasSupabase,
    }),
    [content, loaded, isAdmin, editing, status, error, historyLen, showLogin, update, replaceAll, undo, moveSection, deleteSection, addSection, requestAdmin, logout, login, resetToDefault],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
