import { useEffect, useMemo, useRef } from 'react'
import { useStore } from '../store'

/* ---------- scroll progress bar ---------- */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const fn = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight
      const pct = h > 0 ? (window.scrollY / h) * 100 : 0
      if (ref.current) ref.current.style.width = Math.min(100, Math.max(0, pct)) + '%'
    }
    fn()
    window.addEventListener('scroll', fn, { passive: true })
    window.addEventListener('resize', fn)
    return () => {
      window.removeEventListener('scroll', fn)
      window.removeEventListener('resize', fn)
    }
  }, [])
  return <div className="scroll-progress-bar" ref={ref} aria-hidden="true" />
}

/* ---------- custom cursor ---------- */
export function Cursor() {
  const { editMode } = useStore()
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (editMode || !fine || reduced || window.innerWidth < 860) return
    let mx = -100,
      my = -100,
      rx = -100,
      ry = -100,
      visible = false,
      raf = 0
    const move = (e: MouseEvent) => {
      mx = e.clientX
      my = e.clientY
      if (!visible) {
        visible = true
        rx = mx
        ry = my
        if (dot.current) dot.current.style.opacity = '1'
        if (ring.current) ring.current.style.opacity = '1'
      }
      if (dot.current) dot.current.style.transform = `translate3d(${mx}px,${my}px,0) translate(-50%,-50%)`
    }
    const leave = () => {
      visible = false
      if (dot.current) dot.current.style.opacity = '0'
      if (ring.current) ring.current.style.opacity = '0'
    }
    const loop = () => {
      if (visible && ring.current) {
        rx += (mx - rx) * 0.18
        ry += (my - ry) * 0.18
        ring.current.style.transform = `translate3d(${rx.toFixed(2)}px,${ry.toFixed(2)}px,0) translate(-50%,-50%)`
      }
      raf = requestAnimationFrame(loop)
    }
    // event delegation so newly added elements work too
    const sel = 'a, button, .chip, .project-visual, .focus-card, .achievement-card'
    const over = (e: MouseEvent) => {
      if ((e.target as Element).closest?.(sel)) ring.current?.classList.add('cursor-hover')
      else ring.current?.classList.remove('cursor-hover')
    }
    window.addEventListener('mousemove', move, { passive: true })
    window.addEventListener('mouseover', over, { passive: true })
    document.addEventListener('mouseleave', leave)
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', over)
      document.removeEventListener('mouseleave', leave)
    }
  }, [editMode])

  if (editMode) return null
  return (
    <>
      <div className="cursor-dot" ref={dot} aria-hidden="true" />
      <div className="cursor-ring" ref={ring} aria-hidden="true" />
    </>
  )
}

/* ---------- hero topographic background ---------- */
function mulberry32(a: number) {
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function TopoBackground() {
  const ref = useRef<SVGSVGElement>(null)
  const W = 1600
  const H = 900

  const shapes = useMemo(() => {
    const rnd = mulberry32(7)
    const colours = ['#3c554c', '#4a6e5f', '#5c8374', '#3a6b5a', '#2e4d40', '#4d7a68', '#3f6354', '#507060']
    const noise = (x: number, y: number, seed: number) =>
      Math.sin(x * 0.007 + seed * 1.3) * Math.cos(y * 0.009 + seed * 0.7) +
      Math.sin(x * 0.015 + seed * 2.1) * Math.cos(y * 0.018 + seed * 1.4) * 0.5 +
      Math.sin(x * 0.03 + seed * 0.9) * Math.cos(y * 0.025 + seed * 3.1) * 0.25
    const out: { kind: 'line' | 'curve'; d: string; col: string; w: number; o: number }[] = []
    const LAYERS = 18
    for (let l = 0; l < LAYERS; l++) {
      const seed = l * 0.618 + 0.2
      const level = -0.9 + (l / LAYERS) * 1.8
      const col = colours[l % colours.length]
      const o = 0.2 + rnd() * 0.35
      const w = 0.6 + rnd() * 0.9
      for (let y = 0; y < H; y += 32) {
        const pts: string[] = []
        let inLine = false
        for (let x = 0; x <= W; x += 8) {
          const above = noise(x, y, seed) > level
          if (above && !inLine) {
            inLine = true
            pts.push(`${x},${y}`)
          }
          if (inLine) pts.push(`${x},${(y + noise(x, y + 100, seed + 5) * 28).toFixed(1)}`)
          if (!above && inLine) inLine = false
        }
        if (pts.length > 3) out.push({ kind: 'line', d: pts.join(' '), col, w, o })
      }
    }
    for (let c = 0; c < 12; c++) {
      const s2 = c * 1.23 + 0.5
      const col = colours[c % colours.length]
      const sx = rnd() * W * 0.4
      const sy = 60 + c * (H / 12)
      let d = `M ${sx.toFixed(0)},${sy.toFixed(0)}`
      let cx = sx
      let cy = sy
      for (let s = 0; s < 8; s++) {
        const dx = W / 8 + Math.sin(s2 + s) * 80
        const dy = Math.cos(s2 * 2 + s) * 60
        const cpx = cx + dx / 2 + Math.sin(s2 + s * 2) * 60
        const cpy = cy + dy / 2 + Math.cos(s2 * 1.5 + s) * 40
        cx += dx
        cy += dy
        d += ` Q ${cpx.toFixed(0)},${cpy.toFixed(0)} ${cx.toFixed(0)},${cy.toFixed(0)}`
      }
      out.push({ kind: 'curve', d, col, w: 0.8 + rnd() * 1.2, o: 0.15 + rnd() * 0.3 })
    }
    return out
  }, [])

  useEffect(() => {
    const fn = () => {
      if (ref.current) ref.current.style.transform = `translateY(${window.scrollY * 0.18}px)`
    }
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <svg ref={ref} viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.55 }}>
      {shapes.map((s, i) =>
        s.kind === 'line' ? (
          <polyline key={i} points={s.d} fill="none" stroke={s.col} strokeWidth={s.w} opacity={s.o} />
        ) : (
          <path key={i} d={s.d} fill="none" stroke={s.col} strokeWidth={s.w} opacity={s.o} />
        ),
      )}
    </svg>
  )
}
