import {
  createElement,
  Fragment,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { useStore } from '../store'

/* ---------- helpers ---------- */

export const moveItem = (arr: unknown[], i: number, d: number) => {
  const j = i + d
  if (j < 0 || j >= arr.length) return
  ;[arr[i], arr[j]] = [arr[j], arr[i]]
}

export function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || seen) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true)
          io.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [seen])
  return [ref, seen] as const
}

/* ---------- inline markup ---------- */

/** *emphasis* -> <em>, newline -> <br> */
export function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split('\n').map((ln, i) => (
        <Fragment key={i}>
          {i > 0 && <br />}
          {ln.split(/(\*[^*]+\*)/g).map((p, j) =>
            /^\*[^*]+\*$/.test(p) ? <em key={j}>{p.slice(1, -1)}</em> : p,
          )}
        </Fragment>
      ))}
    </>
  )
}

/** **bold** -> <strong> */
export function Bold({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*)/g).map((p, j) =>
        /^\*\*[^*]+\*\*$/.test(p) ? <strong key={j}>{p.slice(2, -2)}</strong> : p,
      )}
    </>
  )
}

/* ---------- scroll reveal ---------- */

export function Reveal({
  children,
  className,
  delay,
}: {
  children: ReactNode
  className?: string
  delay?: 1 | 2 | 3 | 4
}) {
  const { editMode } = useStore()
  const [ref, seen] = useInView<HTMLDivElement>()
  return (
    <div
      ref={ref}
      className={[className, seen || editMode ? 'is-in' : ''].filter(Boolean).join(' ')}
      data-reveal="up"
      data-reveal-delay={delay}
    >
      {children}
    </div>
  )
}

/* ---------- editable text ---------- */

const PLAIN = (() => {
  if (typeof document === 'undefined') return false
  const d = document.createElement('div')
  try {
    d.contentEditable = 'plaintext-only'
  } catch {
    return false
  }
  return d.contentEditable === 'plaintext-only'
})()

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

interface TextProps {
  v: string
  on: (v: string) => void
  as?: string
  className?: string
  style?: CSSProperties
  multiline?: boolean
  placeholder?: string
  /** how to render the value when NOT editing (e.g. markup) */
  render?: (v: string) => ReactNode
}

export function Text({ v, on, as = 'span', className, style, multiline, placeholder, render }: TextProps) {
  const { editMode } = useStore()
  if (!editMode) return createElement(as, { className, style }, render ? render(v) : v)
  return createElement(as, {
    className: [className, 'editable', v ? '' : 'empty'].filter(Boolean).join(' '),
    style,
    contentEditable: PLAIN ? 'plaintext-only' : true,
    suppressContentEditableWarning: true,
    spellCheck: false,
    'data-placeholder': placeholder || 'Click to edit',
    dangerouslySetInnerHTML: { __html: esc(v) },
    onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => {
      if (e.key === 'Enter' && !multiline) {
        e.preventDefault()
        e.currentTarget.blur()
      }
    },
    onPaste: (e: React.ClipboardEvent<HTMLElement>) => {
      e.preventDefault()
      const t = e.clipboardData.getData('text/plain')
      document.execCommand('insertText', false, multiline ? t : t.replace(/\n+/g, ' '))
    },
    onBlur: (e: React.FocusEvent<HTMLElement>) => {
      let t = (e.currentTarget.innerText || '').replace(/ /g, ' ').replace(/\n+$/, '')
      if (!multiline) t = t.replace(/\n+/g, ' ')
      if (t !== v) on(t)
    },
  })
}

/* ---------- item controls ---------- */

export function ItemBar({
  i,
  n,
  onMove,
  onDelete,
  children,
}: {
  i: number
  n: number
  onMove: (d: -1 | 1) => void
  onDelete: () => void
  children?: ReactNode
}) {
  const { editMode } = useStore()
  if (!editMode) return null
  return (
    <div className="item-bar" contentEditable={false}>
      {children}
      <button disabled={i === 0} onClick={() => onMove(-1)} title="Move up">
        ↑
      </button>
      <button disabled={i === n - 1} onClick={() => onMove(1)} title="Move down">
        ↓
      </button>
      <button className="danger" onClick={onDelete} title="Delete">
        ✕
      </button>
    </div>
  )
}

export function AddBtn({ label, onClick, className }: { label: string; onClick: () => void; className?: string }) {
  const { editMode } = useStore()
  if (!editMode) return null
  return (
    <button className={'add-btn ' + (className || '')} onClick={onClick}>
      + {label}
    </button>
  )
}

/* ---------- chips ---------- */

export function Chips({
  items,
  onChange,
  className = 'stack-chips',
}: {
  items: string[]
  onChange: (next: string[]) => void
  className?: string
}) {
  const { editMode } = useStore()
  const [ref, seen] = useInView<HTMLDivElement>()
  return (
    <div ref={ref} className={className + (seen || editMode ? ' is-animated' : '')}>
      {items.map((t, i) => (
        <span className="chip chip-edit" key={i} style={editMode ? undefined : { transitionDelay: `${i * 45}ms` }}>
          <Text
            v={t}
            on={(v) => onChange(items.map((x, k) => (k === i ? v : x)))}
          />
          {editMode && (
            <button className="chip-x" title="Remove" onClick={() => onChange(items.filter((_, k) => k !== i))}>
              ×
            </button>
          )}
        </span>
      ))}
      {editMode && (
        <button className="chip chip-add" onClick={() => onChange([...items, 'New'])}>
          + add
        </button>
      )}
    </div>
  )
}

/* ---------- list of strings (paragraphs, meta lines) ---------- */

export function TextList({
  items,
  onChange,
  wrapAs = 'div',
  itemAs = 'p',
  className,
  itemClass,
  multiline,
  addLabel,
  render,
}: {
  items: string[]
  onChange: (next: string[]) => void
  wrapAs?: string
  itemAs?: string
  className?: string
  itemClass?: string
  multiline?: boolean
  addLabel: string
  render?: (v: string) => ReactNode
}) {
  const edit = (fn: (a: string[]) => void) => {
    const a = [...items]
    fn(a)
    onChange(a)
  }
  return createElement(
    wrapAs,
    { className },
    items.map((t, i) => (
      <div className="item item-inline" key={i}>
        <Text v={t} as={itemAs} className={itemClass} multiline={multiline} render={render} on={(v) => edit((a) => void (a[i] = v))} />
        <ItemBar i={i} n={items.length} onMove={(d) => edit((a) => moveItem(a, i, d))} onDelete={() => edit((a) => void a.splice(i, 1))} />
      </div>
    )),
    <AddBtn key="add" label={addLabel} onClick={() => onChange([...items, 'New text'])} />,
  )
}

/* ---------- image slot (upload / replace / remove) ---------- */

export function ImageSlot({
  src,
  onChange,
  fallback,
  alt,
  label = 'image',
}: {
  src: string | null
  onChange: (url: string | null) => void
  fallback?: ReactNode
  alt?: string
  label?: string
}) {
  const { editMode, uploadImage } = useStore()
  const input = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)

  const pick = async (f?: File) => {
    if (!f) return
    setBusy(true)
    try {
      onChange(await uploadImage(f))
    } catch (e) {
      alert('Upload failed: ' + (e instanceof Error ? e.message : String(e)))
    } finally {
      setBusy(false)
      if (input.current) input.current.value = ''
    }
  }

  return (
    <>
      {src ? <img src={src} alt={alt || ''} loading="lazy" /> : fallback}
      {editMode && (
        <div className="img-tools" contentEditable={false}>
          <button onClick={() => input.current?.click()} disabled={busy}>
            {busy ? 'Uploading…' : src ? `Replace ${label}` : `Upload ${label}`}
          </button>
          {src && (
            <button className="danger" onClick={() => onChange(null)}>
              Remove
            </button>
          )}
          <input ref={input} type="file" accept="image/*" hidden onChange={(e) => pick(e.target.files?.[0])} />
        </div>
      )}
    </>
  )
}

/* ---------- section header + toolbar ---------- */

export function SectionBar({ id, type, navLabel }: { id: string; type: string; navLabel: string }) {
  const { editMode, content, moveSection, deleteSection, update } = useStore()
  if (!editMode) return null
  const i = content.sections.findIndex((s) => s.id === id)
  return (
    <div className="section-bar" contentEditable={false}>
      <span className="sb-type">{type}</span>
      {type !== 'hero' && (
        <input
          className="sb-nav"
          value={navLabel}
          placeholder="Nav label (empty = hidden)"
          onChange={(e) => update((c) => void (c.sections.find((s) => s.id === id)!.navLabel = e.target.value))}
        />
      )}
      <button disabled={i <= 0} onClick={() => moveSection(id, -1)} title="Move section up">
        ↑
      </button>
      <button disabled={i >= content.sections.length - 1} onClick={() => moveSection(id, 1)} title="Move section down">
        ↓
      </button>
      <button
        className="danger"
        title="Delete section"
        onClick={() => {
          if (window.confirm('Delete this whole section? (You can press Undo in the bottom bar.)')) deleteSection(id)
        }}
      >
        Delete
      </button>
    </div>
  )
}

export function SectionHead({
  s,
  set,
}: {
  s: { num: string; heading: string }
  set: (fn: (s: { num: string; heading: string }) => void) => void
}) {
  return (
    <Reveal className="section-head">
      <Text as="div" className="section-num mono" v={s.num} on={(v) => set((x) => void (x.num = v))} />
      <Text as="h2" v={s.heading} on={(v) => set((x) => void (x.heading = v))} />
    </Reveal>
  )
}
