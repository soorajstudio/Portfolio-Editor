import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { StoreProvider, useStore } from './store'
import type { Content, Section } from './types'
import { uid } from './defaultContent'
import { Text } from './components/ui'
import { Cursor, ScrollProgress } from './components/effects'
import { About, Cards, Contact, Education, Hero, Projects, Skills, TextBlock, Timeline } from './components/sections'

/* ---------- navigation ---------- */

function Nav() {
  const { content, editMode, update } = useStore()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')
  const [clock, setClock] = useState('')

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    fn()
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    const tick = () => {
      const d = new Date()
      const p = (n: number) => String(n).padStart(2, '0')
      setClock(`${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())} IST`)
    }
    tick()
    const t = setInterval(tick, 1000)
    return () => clearInterval(t)
  }, [])

  const ids = content.sections.map((s) => s.id).join(',')
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id)
        }),
      { threshold: 0.35, rootMargin: '-10% 0px -40% 0px' },
    )
    document.querySelectorAll('main section[id]').forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [ids])

  const links = content.sections.filter((s) => s.navLabel.trim())
  const [a, b] = content.site.brand.split('·')

  return (
    <nav className={'nav' + (scrolled ? ' scrolled' : '')}>
      {editMode ? (
        <div className="nav-mark">
          <Text v={content.site.brand} on={(v) => update((c) => void (c.site.brand = v))} />
        </div>
      ) : (
        <a href="#top" className="nav-mark">
          {a}
          {b !== undefined && <span>·</span>}
          {b}
        </a>
      )}
      <ul className={'nav-links' + (open ? ' open' : '')}>
        <li>
          <button className="nav-close-btn" aria-label="Close menu" onClick={() => setOpen(false)}>
            ✕
          </button>
        </li>
        {links.map((s) => (
          <li key={s.id}>
            <a href={'#' + s.id} className={active === s.id ? 'active' : ''} onClick={() => setOpen(false)}>
              {s.navLabel}
            </a>
          </li>
        ))}
      </ul>
      <div className="nav-ticker mono">
        <span className="dot" />
        <Text v={content.site.coords} on={(v) => update((c) => void (c.site.coords = v))} />
        <span>— {clock}</span>
      </div>
      {editMode ? (
        <span className="nav-cta">
          <Text v={content.site.cta} on={(v) => update((c) => void (c.site.cta = v))} />
        </span>
      ) : (
        <a href="#contact" className="nav-cta">
          {content.site.cta}
        </a>
      )}
      <button className="nav-burger" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(true)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M3 6h18M3 12h18M3 18h18" />
        </svg>
      </button>
    </nav>
  )
}

/* ---------- section router ---------- */

function SectionRenderer({ s }: { s: Section }) {
  const { update } = useStore()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const set = (fn: (x: any) => void) =>
    update((c) => {
      const t = c.sections.find((x) => x.id === s.id)
      if (t) fn(t)
    })
  switch (s.type) {
    case 'hero':
      return <Hero s={s} set={set} />
    case 'about':
      return <About s={s} set={set} />
    case 'skills':
      return <Skills s={s} set={set} />
    case 'timeline':
      return <Timeline s={s} set={set} />
    case 'projects':
      return <Projects s={s} set={set} />
    case 'education':
      return <Education s={s} set={set} />
    case 'cards':
      return <Cards s={s} set={set} />
    case 'text':
      return <TextBlock s={s} set={set} />
    case 'contact':
      return <Contact s={s} set={set} />
  }
}

/* ---------- new-section templates ---------- */

const TEMPLATES: { label: string; hint: string; make: () => Section }[] = [
  {
    label: 'Certificates / awards (card grid)',
    hint: 'Cards with icon, title, caption, optional image',
    make: () => ({
      id: uid(),
      type: 'cards',
      navLabel: 'Certificates',
      num: '09 — CERTIFICATES',
      heading: 'New certificates.',
      items: [{ icon: 'award', title: 'Certificate title', sub: 'Issuer · Year', body: '', image: null }],
    }),
  },
  {
    label: 'Projects (with images)',
    hint: 'Alternating image + description rows',
    make: () => ({
      id: uid(),
      type: 'projects',
      navLabel: 'Projects',
      num: '09 — PROJECTS',
      heading: 'More things I built.',
      items: [{ tag: 'Category', title: 'Project name', body: 'Describe what you built.', chips: ['Tech'], image: null, visual: 'generic' }],
    }),
  },
  {
    label: 'Timeline (experience)',
    hint: 'Dated entries on a vertical line',
    make: () => ({
      id: uid(),
      type: 'timeline',
      navLabel: 'Timeline',
      num: '09 — TIMELINE',
      heading: 'New timeline.',
      items: [{ meta: 'DATES', title: 'Role title', org: 'Organisation', body: 'What you did.', current: false }],
    }),
  },
  {
    label: 'Education list',
    hint: 'Period, degree, institution, place',
    make: () => ({
      id: uid(),
      type: 'education',
      navLabel: 'Education',
      num: '09 — EDUCATION',
      heading: 'More learning.',
      rows: [{ period: 'YYYY — YYYY', title: 'Degree / course', sub: 'Institution', loc: 'CITY' }],
    }),
  },
  {
    label: 'Skills (chips)',
    hint: 'Grouped skill tags and focus cards',
    make: () => ({
      id: uid(),
      type: 'skills',
      navLabel: 'Skills',
      num: '09 — SKILLS',
      heading: 'More skills.',
      focus: [],
      groups: [{ title: 'Group', chips: ['Skill'] }],
    }),
  },
  {
    label: 'Text block',
    hint: 'Heading plus free paragraphs',
    make: () => ({
      id: uid(),
      type: 'text',
      navLabel: 'Notes',
      num: '09 — NOTES',
      heading: 'A new section.',
      paragraphs: ['Write something here.'],
    }),
  },
  {
    label: 'About (photo + stats)',
    hint: 'Image, paragraphs, stat grid, chips',
    make: () => ({
      id: uid(),
      type: 'about',
      navLabel: 'About',
      num: '09 — ABOUT',
      heading: 'Another orientation.',
      image: null,
      captionLeft: 'FIG. 02',
      captionRight: 'PLACE',
      paragraphs: ['Write something here.'],
      stats: [{ label: 'Label', value: 'Value' }],
      hobbies: [],
    }),
  },
]

/* ---------- admin / edit bar ---------- */

function EditBar() {
  const s = useStore()
  const [menu, setMenu] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  if (!s.isAdmin) return null

  if (!s.editing) {
    return (
      <div className="edit-bar compact">
        <button className="eb-btn primary" onClick={() => s.setEditing(true)}>
          ✎ Back to editing
        </button>
      </div>
    )
  }

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(s.content, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'portfolio-content.json'
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const importJson = async (f?: File) => {
    if (!f) return
    try {
      const data = JSON.parse(await f.text()) as Content
      if (!Array.isArray(data.sections) || !data.site) throw new Error('Not a portfolio export file.')
      s.replaceAll(data)
    } catch (e) {
      alert('Import failed: ' + (e instanceof Error ? e.message : String(e)))
    }
    if (fileRef.current) fileRef.current.value = ''
  }

  const statusText = { idle: 'Editing', saving: 'Saving…', saved: '✓ Saved', error: '⚠ Save failed' }[s.status]

  return (
    <div className="edit-bar">
      <span className={'eb-status ' + s.status} title={s.error}>
        {statusText}
        {s.localMode && <em> · local mode</em>}
      </span>
      <div className="eb-menu-wrap">
        <button className="eb-btn primary" onClick={() => setMenu((m) => !m)}>
          + Add section
        </button>
        {menu && (
          <div className="eb-menu">
            {TEMPLATES.map((t) => (
              <button
                key={t.label}
                onClick={() => {
                  s.addSection(t.make())
                  setMenu(false)
                  setTimeout(() => window.scrollTo({ top: document.body.scrollHeight * 0.9, behavior: 'smooth' }), 80)
                }}
              >
                <strong>{t.label}</strong>
                <small>{t.hint}</small>
              </button>
            ))}
          </div>
        )}
      </div>
      <button className="eb-btn" onClick={s.undo} disabled={!s.canUndo}>
        ↶ Undo
      </button>
      <button
        className="eb-btn"
        onClick={() => {
          const t = window.prompt('Browser tab title', s.content.site.title)
          if (t !== null) s.update((c) => void (c.site.title = t))
        }}
      >
        Page title
      </button>
      <button className="eb-btn" onClick={exportJson}>
        Export
      </button>
      <button className="eb-btn" onClick={() => fileRef.current?.click()}>
        Import
      </button>
      <input ref={fileRef} type="file" accept="application/json" hidden onChange={(e) => importJson(e.target.files?.[0])} />
      <button
        className="eb-btn"
        onClick={() => {
          if (window.confirm('Reset ALL content back to the original version? (Undo is available.)')) s.resetToDefault()
        }}
      >
        Reset
      </button>
      <button className="eb-btn" onClick={() => s.setEditing(false)}>
        Preview
      </button>
      <button className="eb-btn" onClick={() => s.logout()}>
        {s.localMode ? 'Exit' : 'Log out'}
      </button>
    </div>
  )
}

function LoginModal() {
  const { showLogin, closeLogin, login } = useStore()
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  if (!showLogin) return null
  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setErr('')
    try {
      await login(email, pw)
      setPw('')
    } catch (x) {
      setErr(x instanceof Error ? x.message : String(x))
    } finally {
      setBusy(false)
    }
  }
  return (
    <div className="modal-back" onClick={closeLogin}>
      <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <h3>Owner login</h3>
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoFocus required />
        </label>
        <label>
          Password
          <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} required />
        </label>
        {err && <div className="modal-err">{err}</div>}
        <div className="modal-actions">
          <button type="button" className="eb-btn" onClick={closeLogin}>
            Cancel
          </button>
          <button className="eb-btn primary" disabled={busy}>
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </div>
      </form>
    </div>
  )
}

/* ---------- page ---------- */

function Page() {
  const { content, editMode, requestAdmin, update, loaded } = useStore()

  useEffect(() => {
    document.title = content.site.title
  }, [content.site.title])
  useEffect(() => {
    document.body.classList.toggle('edit-mode', editMode)
  }, [editMode])

  // Ctrl/Cmd + Shift + E opens the admin
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'e') {
        e.preventDefault()
        requestAdmin()
      }
    }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [requestAdmin])

  const sections = useMemo(() => content.sections, [content.sections])

  return (
    <div style={{ opacity: loaded ? 1 : 0, transition: 'opacity .3s' }}>
      <ScrollProgress />
      <Cursor />
      <Nav />
      <a id="top" />
      <main>
        {sections.map((s) => (
          <SectionRenderer key={s.id} s={s} />
        ))}
      </main>
      <footer>
        <div className="wrap">
          <div className="footer-row">
            <Text v={content.site.footerLeft} on={(v) => update((c) => void (c.site.footerLeft = v))} />
            <Text v={content.site.footerRight} on={(v) => update((c) => void (c.site.footerRight = v))} />
            {!editMode && (
              <button className="admin-link" onClick={requestAdmin} title="Owner login (Ctrl+Shift+E)">
                Admin
              </button>
            )}
          </div>
        </div>
      </footer>
      <EditBar />
      <LoginModal />
    </div>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <Page />
    </StoreProvider>
  )
}
