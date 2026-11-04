import { Fragment, useEffect, useRef, useState, type ReactNode } from 'react'
import type {
  AboutSection,
  CardsSection,
  ContactSection,
  EducationSection,
  HeroSection,
  ProjectsSection,
  SectionProps,
  SkillsSection,
  TextSection,
  TimelineSection,
} from '../types'
import { useStore } from '../store'
import { AddBtn, Bold, Chips, ImageSlot, ItemBar, moveItem, Reveal, Rich, SectionBar, SectionHead, Text, TextList } from './ui'
import { Icon, ICON_NAMES } from './Icon'
import { Avatar, ProjectIllustration, VISUAL_KINDS } from './Visuals'
import { TopoBackground } from './effects'

/* =========================== HERO =========================== */

function Headline({ text }: { text: string }) {
  let n = 0
  const em = (w: string) =>
    w.split(/(\*[^*]+\*)/g).map((p, j) => (/^\*[^*]+\*$/.test(p) ? <em key={j}>{p.slice(1, -1)}</em> : p))
  return (
    <>
      {text.split('\n').map((ln, li) => (
        <Fragment key={li}>
          {li > 0 && <br />}
          {ln
            .split(/\s+/)
            .filter(Boolean)
            .map((w, wi) => (
              <Fragment key={wi}>
                <span className="word-mask">
                  <span className="word-inner" style={{ transitionDelay: `${0.06 + 0.08 * n++}s` }}>
                    {em(w)}
                  </span>
                </span>{' '}
              </Fragment>
            ))}
        </Fragment>
      ))}
    </>
  )
}

export function Hero({ s, set }: SectionProps<HeroSection>) {
  const { editMode } = useStore()
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 120)
    return () => clearTimeout(t)
  }, [])
  return (
    <section className={'hero' + (loaded ? ' is-loaded' : '')} id={s.id}>
      <SectionBar id={s.id} type="hero" navLabel={s.navLabel} />
      <div className="hero-bg">
        <TopoBackground />
      </div>
      <div className="hero-veil" />
      <div className="hero-content wrap">
        <Text as="div" className="hero-eyebrow eyebrow" v={s.eyebrow} on={(v) => set((x) => void (x.eyebrow = v))} />
        <Text
          as="h1"
          multiline
          v={s.headline}
          placeholder="Headline — *word* = brass, new line = line break"
          on={(v) => set((x) => void (x.headline = v))}
          render={(v) => <Headline text={v} />}
        />
        {editMode && <div className="edit-hint">Tip: wrap a word in *stars* to colour it brass. Press Enter for a line break.</div>}
        <Text as="p" multiline className="hero-sub" v={s.sub} on={(v) => set((x) => void (x.sub = v))} />
        <div className="hero-tags">
          {s.tags.map((t, i) => (
            <span className={'tag item ' + t.variant} key={i}>
              <Text v={t.text} on={(v) => set((x) => void (x.tags[i].text = v))} />
              <ItemBar
                i={i}
                n={s.tags.length}
                onMove={(d) => set((x) => moveItem(x.tags, i, d))}
                onDelete={() => set((x) => void x.tags.splice(i, 1))}
              >
                <button
                  title="Change colour"
                  onClick={() =>
                    set((x) => {
                      const order = ['', 'brass', 'contour'] as const
                      x.tags[i].variant = order[(order.indexOf(x.tags[i].variant) + 1) % 3]
                    })
                  }
                >
                  ◐
                </button>
              </ItemBar>
            </span>
          ))}
          <AddBtn label="tag" onClick={() => set((x) => void x.tags.push({ text: 'New tag', variant: '' }))} />
        </div>
      </div>
      <div className="scroll-cue mono">
        <span>SCROLL</span>
        <span className="line" />
      </div>
    </section>
  )
}

/* =========================== ABOUT =========================== */

export function About({ s, set }: SectionProps<AboutSection>) {
  const { editMode } = useStore()
  return (
    <section id={s.id}>
      <SectionBar id={s.id} type="about" navLabel={s.navLabel} />
      <div className="wrap">
        <SectionHead s={s} set={set as never} />
        <div className="about-grid">
          <Reveal>
            <div className="about-frame">
              <span className="corner corner-tr" />
              <span className="corner corner-bl" />
              <div className="about-photo image-slot">
                <ImageSlot src={s.image} onChange={(v) => set((x) => void (x.image = v))} fallback={<Avatar />} alt="Profile" label="photo" />
              </div>
            </div>
            <div className="about-caption">
              <Text v={s.captionLeft} on={(v) => set((x) => void (x.captionLeft = v))} />
              <Text v={s.captionRight} on={(v) => set((x) => void (x.captionRight = v))} />
            </div>
          </Reveal>
          <Reveal delay={1}>
            <TextList
              className="about-text"
              items={s.paragraphs}
              multiline
              addLabel="paragraph"
              onChange={(a) => set((x) => void (x.paragraphs = a))}
              render={(v) => <Bold text={v} />}
            />
            {editMode && <div className="edit-hint">Tip: wrap text in **double stars** to make it bold.</div>}
            <div className="stat-grid">
              {s.stats.map((st, i) => (
                <div className="stat item" key={i}>
                  <Text as="div" className="stat-label" v={st.label} on={(v) => set((x) => void (x.stats[i].label = v))} />
                  <Text as="div" className="stat-value" v={st.value} on={(v) => set((x) => void (x.stats[i].value = v))} />
                  <ItemBar i={i} n={s.stats.length} onMove={(d) => set((x) => moveItem(x.stats, i, d))} onDelete={() => set((x) => void x.stats.splice(i, 1))} />
                </div>
              ))}
            </div>
            <AddBtn label="stat" onClick={() => set((x) => void x.stats.push({ label: 'Label', value: 'Value' }))} />
            <div className="hobby-row">
              <Chips className="hobby-chips" items={s.hobbies} onChange={(a) => set((x) => void (x.hobbies = a))} />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* =========================== SKILLS =========================== */

export function Skills({ s, set }: SectionProps<SkillsSection>) {
  return (
    <section id={s.id}>
      <SectionBar id={s.id} type="skills" navLabel={s.navLabel} />
      <div className="wrap">
        <SectionHead s={s} set={set as never} />
        <Reveal className="focus-grid">
          {s.focus.map((f, i) => (
            <div className="focus-card item" key={i}>
              <Text as="div" className="focus-index mono" v={f.index} on={(v) => set((x) => void (x.focus[i].index = v))} />
              <Text as="h3" v={f.title} on={(v) => set((x) => void (x.focus[i].title = v))} />
              <Text as="p" multiline v={f.body} on={(v) => set((x) => void (x.focus[i].body = v))} />
              <ItemBar i={i} n={s.focus.length} onMove={(d) => set((x) => moveItem(x.focus, i, d))} onDelete={() => set((x) => void x.focus.splice(i, 1))} />
            </div>
          ))}
        </Reveal>
        <AddBtn
          label="focus card"
          className="mb"
          onClick={() => set((x) => void x.focus.push({ index: '/ NEW', title: 'New focus area', body: 'Describe it here.' }))}
        />
        <Reveal className="stack-row" delay={1}>
          {s.groups.map((g, i) => (
            <div className="stack-group item" key={i}>
              <Text as="h4" v={g.title} on={(v) => set((x) => void (x.groups[i].title = v))} />
              <Chips items={g.chips} onChange={(a) => set((x) => void (x.groups[i].chips = a))} />
              <ItemBar i={i} n={s.groups.length} onMove={(d) => set((x) => moveItem(x.groups, i, d))} onDelete={() => set((x) => void x.groups.splice(i, 1))} />
            </div>
          ))}
        </Reveal>
        <AddBtn label="skill group" onClick={() => set((x) => void x.groups.push({ title: 'New group', chips: ['Skill'] }))} />
      </div>
    </section>
  )
}

/* =========================== TIMELINE =========================== */

export function Timeline({ s, set }: SectionProps<TimelineSection>) {
  return (
    <section id={s.id}>
      <SectionBar id={s.id} type="timeline" navLabel={s.navLabel} />
      <div className="wrap">
        <SectionHead s={s} set={set as never} />
        <Reveal className="timeline">
          {s.items.map((it, i) => (
            <div className={'tl-item item' + (it.current ? ' current' : '')} key={i}>
              <div className="tl-meta">
                <Text v={it.meta} on={(v) => set((x) => void (x.items[i].meta = v))} />
              </div>
              <Text as="h3" v={it.title} on={(v) => set((x) => void (x.items[i].title = v))} />
              <Text as="span" className="tl-org" v={it.org} on={(v) => set((x) => void (x.items[i].org = v))} />
              <Text as="p" multiline v={it.body} on={(v) => set((x) => void (x.items[i].body = v))} />
              <ItemBar i={i} n={s.items.length} onMove={(d) => set((x) => moveItem(x.items, i, d))} onDelete={() => set((x) => void x.items.splice(i, 1))}>
                <button title="Toggle filled dot (current)" onClick={() => set((x) => void (x.items[i].current = !x.items[i].current))}>
                  ●
                </button>
              </ItemBar>
            </div>
          ))}
        </Reveal>
        <AddBtn
          label="entry"
          onClick={() => set((x) => void x.items.unshift({ meta: 'DATES', title: 'Role title', org: 'Organisation', body: 'What you did.', current: false }))}
        />
      </div>
    </section>
  )
}

/* =========================== PROJECTS =========================== */

function ProjectVisual({
  image,
  visual,
  title,
  onImage,
  onVisual,
}: {
  image: string | null
  visual: string
  title: string
  onImage: (v: string | null) => void
  onVisual: (v: string) => void
}) {
  const { editMode } = useStore()
  const ref = useRef<HTMLDivElement>(null)
  const tiltable = !editMode && typeof window !== 'undefined' && window.innerWidth >= 860 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const inner = () => ref.current?.querySelector('svg, img') as HTMLElement | null
  return (
    <div
      ref={ref}
      className="project-visual image-slot"
      onMouseMove={
        tiltable
          ? (e) => {
              const r = e.currentTarget.getBoundingClientRect()
              const x = e.clientX - r.left
              const y = e.clientY - r.top
              const cx = r.width / 2
              const cy = r.height / 2
              e.currentTarget.style.transform = `perspective(900px) rotateX(${(((y - cy) / cy) * -7).toFixed(2)}deg) rotateY(${(((x - cx) / cx) * 7).toFixed(2)}deg) scale3d(1.02,1.02,1.02)`
              const el = inner()
              if (el) el.style.transform = `translate3d(${(((x - cx) / cx) * 6).toFixed(1)}px,${(((y - cy) / cy) * 6).toFixed(1)}px,15px)`
            }
          : undefined
      }
      onMouseLeave={
        tiltable
          ? (e) => {
              e.currentTarget.style.transform = 'perspective(900px) rotateX(0) rotateY(0) scale3d(1,1,1)'
              const el = inner()
              if (el) el.style.transform = 'translate3d(0,0,0)'
            }
          : undefined
      }
    >
      <ImageSlot src={image} onChange={onImage} alt={title} fallback={<ProjectIllustration kind={visual} title={title} />} />
      {editMode && !image && (
        <select className="viz-select" value={visual} onChange={(e) => onVisual(e.target.value)} title="Built-in illustration">
          {VISUAL_KINDS.map((k) => (
            <option key={k} value={k}>
              illustration: {k}
            </option>
          ))}
        </select>
      )}
    </div>
  )
}

export function Projects({ s, set }: SectionProps<ProjectsSection>) {
  return (
    <section id={s.id}>
      <SectionBar id={s.id} type="projects" navLabel={s.navLabel} />
      <div className="wrap">
        <SectionHead s={s} set={set as never} />
        {s.items.map((p, i) => (
          <Reveal className="project item" key={i}>
            <ProjectVisual
              image={p.image}
              visual={p.visual}
              title={p.title}
              onImage={(v) => set((x) => void (x.items[i].image = v))}
              onVisual={(v) => set((x) => void (x.items[i].visual = v))}
            />
            <div className="project-body">
              <Text as="span" className="project-tag" v={p.tag} on={(v) => set((x) => void (x.items[i].tag = v))} />
              <Text as="h3" v={p.title} on={(v) => set((x) => void (x.items[i].title = v))} />
              <Text as="p" multiline v={p.body} on={(v) => set((x) => void (x.items[i].body = v))} />
              <Chips className="project-stack" items={p.chips} onChange={(a) => set((x) => void (x.items[i].chips = a))} />
            </div>
            <ItemBar i={i} n={s.items.length} onMove={(d) => set((x) => moveItem(x.items, i, d))} onDelete={() => set((x) => void x.items.splice(i, 1))} />
          </Reveal>
        ))}
        <AddBtn
          label="project"
          onClick={() =>
            set((x) =>
              void x.items.push({ tag: 'Category', title: 'New project', body: 'Describe what you built.', chips: ['Tech'], image: null, visual: 'generic' }),
            )
          }
        />
      </div>
    </section>
  )
}

/* =========================== EDUCATION =========================== */

export function Education({ s, set }: SectionProps<EducationSection>) {
  return (
    <section id={s.id}>
      <SectionBar id={s.id} type="education" navLabel={s.navLabel} />
      <div className="wrap">
        <SectionHead s={s} set={set as never} />
        <Reveal className="edu-list">
          {s.rows.map((r, i) => (
            <div className="edu-row item" key={i}>
              <Text as="div" className="edu-period mono" v={r.period} on={(v) => set((x) => void (x.rows[i].period = v))} />
              <div>
                <Text as="h3" v={r.title} on={(v) => set((x) => void (x.rows[i].title = v))} />
                <Text as="span" className="edu-sub" v={r.sub} on={(v) => set((x) => void (x.rows[i].sub = v))} />
              </div>
              <Text as="div" className="edu-loc mono" v={r.loc} on={(v) => set((x) => void (x.rows[i].loc = v))} />
              <ItemBar i={i} n={s.rows.length} onMove={(d) => set((x) => moveItem(x.rows, i, d))} onDelete={() => set((x) => void x.rows.splice(i, 1))} />
            </div>
          ))}
        </Reveal>
        <AddBtn label="row" onClick={() => set((x) => void x.rows.push({ period: 'YYYY — YYYY', title: 'Degree / course', sub: 'Institution', loc: 'CITY' }))} />
      </div>
    </section>
  )
}

/* =========================== CARDS (certificates, achievements, …) =========================== */

export function Cards({ s, set }: SectionProps<CardsSection>) {
  const { editMode } = useStore()
  return (
    <section id={s.id}>
      <SectionBar id={s.id} type="cards" navLabel={s.navLabel} />
      <div className="wrap">
        <SectionHead s={s} set={set as never} />
        <Reveal className="achievement-grid">
          {s.items.map((c, i) => (
            <div className="achievement-card item" key={i}>
              {editMode ? (
                <button
                  className="icon-btn"
                  title="Change icon"
                  onClick={() => set((x) => void (x.items[i].icon = ICON_NAMES[(ICON_NAMES.indexOf(c.icon as never) + 1) % ICON_NAMES.length]))}
                >
                  <Icon name={c.icon} className="achievement-icon" />
                </button>
              ) : (
                <Icon name={c.icon} className="achievement-icon" />
              )}
              <div className="card-main">
                {(c.image || editMode) && (
                  <div className="card-img image-slot">
                    <ImageSlot src={c.image} onChange={(v) => set((x) => void (x.items[i].image = v))} alt={c.title} label="image" />
                  </div>
                )}
                <Text as="h3" v={c.title} on={(v) => set((x) => void (x.items[i].title = v))} />
                {(c.sub || editMode) && <Text as="span" className="card-sub" v={c.sub} placeholder="Small caption (optional)" on={(v) => set((x) => void (x.items[i].sub = v))} />}
                {(c.body || editMode) && <Text as="p" multiline v={c.body} placeholder="Description (optional)" on={(v) => set((x) => void (x.items[i].body = v))} />}
              </div>
              <ItemBar i={i} n={s.items.length} onMove={(d) => set((x) => moveItem(x.items, i, d))} onDelete={() => set((x) => void x.items.splice(i, 1))} />
            </div>
          ))}
        </Reveal>
        <AddBtn label="card" onClick={() => set((x) => void x.items.push({ icon: 'award', title: 'New item', sub: 'Certificate', body: '', image: null }))} />
      </div>
    </section>
  )
}

/* =========================== TEXT =========================== */

export function TextBlock({ s, set }: SectionProps<TextSection>) {
  return (
    <section id={s.id}>
      <SectionBar id={s.id} type="text" navLabel={s.navLabel} />
      <div className="wrap">
        <SectionHead s={s} set={set as never} />
        <Reveal>
          <TextList
            className="about-text text-block"
            items={s.paragraphs}
            multiline
            addLabel="paragraph"
            onChange={(a) => set((x) => void (x.paragraphs = a))}
            render={(v) => <Bold text={v} />}
          />
        </Reveal>
      </div>
    </section>
  )
}

/* =========================== CONTACT =========================== */

function Magnetic({ children, ...rest }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { children: ReactNode }) {
  return (
    <a
      {...rest}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        e.currentTarget.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.22}px,${(e.clientY - r.top - r.height / 2) * 0.22}px)`
      }}
      onMouseLeave={(e) => (e.currentTarget.style.transform = '')}
    >
      {children}
    </a>
  )
}

export function Contact({ s, set }: SectionProps<ContactSection>) {
  const { editMode } = useStore()
  return (
    <section id={s.id} className="contact">
      <SectionBar id={s.id} type="contact" navLabel={s.navLabel} />
      <div className="wrap contact-inner">
        <Reveal>
          <Text as="div" className="eyebrow" v={s.eyebrow} on={(v) => set((x) => void (x.eyebrow = v))} />
          <Text as="h2" multiline style={{ marginTop: 22 }} v={s.heading} on={(v) => set((x) => void (x.heading = v))} render={(v) => <Rich text={v} />} />
          {editMode && <div className="edit-hint">Tip: *stars* = brass colour, Enter = line break.</div>}
          <Text as="p" multiline className="contact-sub" v={s.sub} on={(v) => set((x) => void (x.sub = v))} />
          <div className="contact-links">
            {s.buttons.map((b, i) => {
              const cls = 'contact-btn magnetic ' + b.variant
              const ext = /^https?:/.test(b.href)
              return editMode ? (
                <span className="item btn-edit" key={i}>
                  <span className={cls}>
                    <Text v={b.label} on={(v) => set((x) => void (x.buttons[i].label = v))} />
                  </span>
                  <input
                    className="href-input"
                    value={b.href}
                    placeholder="Link (https://…, mailto:…, tel:…)"
                    onChange={(e) => set((x) => void (x.buttons[i].href = e.target.value))}
                  />
                  <ItemBar i={i} n={s.buttons.length} onMove={(d) => set((x) => moveItem(x.buttons, i, d))} onDelete={() => set((x) => void x.buttons.splice(i, 1))}>
                    <button
                      title="Change style"
                      onClick={() =>
                        set((x) => {
                          const order = ['', 'primary', 'secondary'] as const
                          x.buttons[i].variant = order[(order.indexOf(x.buttons[i].variant) + 1) % 3]
                        })
                      }
                    >
                      ◐
                    </button>
                  </ItemBar>
                </span>
              ) : (
                <Magnetic key={i} className={cls} href={b.href} {...(ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                  {b.label}
                </Magnetic>
              )
            })}
          </div>
          <AddBtn label="button" onClick={() => set((x) => void x.buttons.push({ label: 'New link', href: 'https://', variant: '' }))} />
          <TextList
            className="contact-meta"
            wrapAs="div"
            itemAs="span"
            items={s.meta}
            addLabel="line"
            onChange={(a) => set((x) => void (x.meta = a))}
          />
        </Reveal>
      </div>
    </section>
  )
}
