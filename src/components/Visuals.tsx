import type { ReactNode } from 'react'

const MONO = 'JetBrains Mono,monospace'

function Grid({ w, h, s, c = 'rgba(92,131,116,0.07)' }: { w: number; h: number; s: number; c?: string }) {
  const xs: number[] = []
  const ys: number[] = []
  for (let x = 0; x < w; x += s) xs.push(x)
  for (let y = 0; y < h; y += s) ys.push(y)
  return (
    <g>
      {xs.map((x) => (
        <line key={'x' + x} x1={x} y1={0} x2={x} y2={h} stroke={c} strokeWidth={1} />
      ))}
      {ys.map((y) => (
        <line key={'y' + y} x1={0} y1={y} x2={w} y2={y} stroke={c} strokeWidth={1} />
      ))}
    </g>
  )
}

function Frame({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 400 300" width="100%" height="100%">
      {children}
    </svg>
  )
}

const Label = ({ y = 286, c, t }: { y?: number; c: string; t: string }) => (
  <text x={200} y={y} textAnchor="middle" fontFamily={MONO} fontSize={10} fill={c} letterSpacing="0.1em">
    {t}
  </text>
)

export function JewelleryVisual() {
  const cx = 200
  const cy = 145
  const g = [
    [cx, cy - 58],
    [cx - 38, cy - 12],
    [cx + 38, cy - 12],
    [cx - 52, cy + 10],
    [cx + 52, cy + 10],
    [cx - 28, cy + 50],
    [cx + 28, cy + 50],
    [cx, cy + 72],
  ]
  const path = [0, 1, 3, 5, 7, 6, 4, 2].map((i, k) => (k ? 'L' : 'M') + g[i].join(',')).join(' ') + ' Z'
  const cyl = (x: number) => (
    <g key={x}>
      <ellipse cx={x} cy={80} rx={32} ry={9} fill="rgba(92,131,116,0.1)" stroke="#5c8374" strokeWidth={1.3} />
      <rect x={x - 32} y={80} width={64} height={80} fill="rgba(92,131,116,0.07)" stroke="#5c8374" strokeWidth={1.3} />
      <ellipse cx={x} cy={160} rx={32} ry={9} fill="rgba(92,131,116,0.12)" stroke="#5c8374" strokeWidth={1.3} />
      {[1, 2].map((i) => (
        <ellipse key={i} cx={x} cy={80 + (80 * i) / 3} rx={32} ry={5.8} fill="none" stroke="#5c8374" strokeWidth={0.6} opacity={0.4} />
      ))}
    </g>
  )
  const tag = (x: number, y: number) => (
    <g key={x + ',' + y}>
      <rect x={x} y={y} width={36} height={20} rx={3} fill="none" stroke="rgba(201,154,75,0.5)" strokeWidth={1.2} />
      <circle cx={x + 29} cy={y + 4} r={3} fill="none" stroke="rgba(201,154,75,0.5)" strokeWidth={1} />
    </g>
  )
  return (
    <Frame>
      <Grid w={400} h={300} s={24} />
      <path d={path} fill="rgba(201,154,75,0.08)" stroke="#c99a4b" strokeWidth={1.8} />
      {[
        [0, 7, 0.3],
        [1, 6, 0.25],
        [2, 5, 0.25],
        [3, 4, 0.2],
      ].map(([a, b, o]) => (
        <line key={a} x1={g[a][0]} y1={g[a][1]} x2={g[b][0]} y2={g[b][1]} stroke={`rgba(201,154,75,${o})`} strokeWidth={0.8} />
      ))}
      {cyl(72)}
      {cyl(328)}
      <line x1={104} y1={120} x2={cx - 52} y2={cy + 10} stroke="rgba(92,131,116,0.5)" strokeDasharray="5 4" />
      <line x1={296} y1={120} x2={cx + 52} y2={cy + 10} stroke="rgba(92,131,116,0.5)" strokeDasharray="5 4" />
      {tag(22, 220)}
      {tag(342, 220)}
      {tag(182, 26)}
      <Label y={286} c="rgba(201,154,75,0.5)" t="JEWELLERY ERP · DUKESOFT" />
    </Frame>
  )
}

export function WardHubVisual() {
  const bx = 120
  const by = 60
  const wins = []
  for (let r = 0; r < 4; r++)
    for (let c = 0; c < 4; c++) {
      const lit = (r + c) % 3 !== 0
      wins.push(
        <rect
          key={r + '-' + c}
          x={bx + 18 + c * 36}
          y={by + 18 + r * 30}
          width={18}
          height={18}
          rx={2}
          fill={lit ? 'rgba(92,131,116,0.25)' : 'rgba(201,154,75,0.1)'}
          stroke={lit ? 'rgba(92,131,116,0.5)' : 'rgba(201,154,75,0.4)'}
          strokeWidth={0.8}
        />,
      )
    }
  return (
    <Frame>
      <Grid w={400} h={300} s={24} />
      <rect x={bx} y={by} width={160} height={140} fill="rgba(15,26,44,0.5)" stroke="rgba(92,131,116,0.6)" strokeWidth={1.5} />
      {wins}
      {[
        [80, 240],
        [200, 250],
        [320, 240],
      ].map(([x, y]) => (
        <g key={x}>
          <circle cx={x} cy={y} r={12} fill="rgba(92,131,116,0.12)" stroke="#5c8374" strokeWidth={1.5} />
          <line x1={x} y1={y - 12} x2={200} y2={by + 140} stroke="rgba(92,131,116,0.3)" strokeWidth={0.8} strokeDasharray="3 3" />
        </g>
      ))}
      <Label y={288} c="rgba(92,131,116,0.5)" t="WARD HUB · COMMUNITY PLATFORM" />
    </Frame>
  )
}

export function SchoolZoneVisual() {
  const xs: number[] = []
  for (let x = 0; x < 400; x += 30) xs.push(x)
  const ys: number[] = []
  for (let y = 0; y < 300; y += 30) ys.push(y)
  return (
    <Frame>
      <Grid w={400} h={300} s={30} />
      <rect x={0} y={130} width={400} height={30} fill="rgba(92,131,116,0.08)" />
      <rect x={170} y={0} width={30} height={300} fill="rgba(92,131,116,0.08)" />
      {xs.map((x) => (
        <line key={'a' + x} x1={x} y1={145} x2={x + 18} y2={145} stroke="rgba(238,231,216,0.15)" strokeWidth={1.5} />
      ))}
      {ys.map((y) => (
        <line key={'b' + y} x1={185} y1={y} x2={185} y2={y + 18} stroke="rgba(238,231,216,0.15)" strokeWidth={1.5} />
      ))}
      <rect x={155} y={60} width={60} height={50} fill="rgba(201,154,75,0.08)" stroke="#c99a4b" strokeWidth={1.5} />
      <polygon points="150,60 215,60 182,38" fill="rgba(201,154,75,0.12)" stroke="#c99a4b" strokeWidth={1.2} />
      <circle cx={185} cy={88} r={72} fill="rgba(201,154,75,0.03)" stroke="rgba(201,154,75,0.4)" strokeWidth={1.5} strokeDasharray="6 4" />
      <circle cx={95} cy={145} r={10} fill="rgba(201,154,75,0.15)" stroke="#c99a4b" strokeWidth={1.5} />
      <text x={95} y={149} textAnchor="middle" fontFamily="sans-serif" fontSize={11} fontWeight="bold" fill="#c99a4b">
        !
      </text>
      <Label y={288} c="rgba(92,131,116,0.5)" t="SCHOOL ZONE ALERT · GIS" />
    </Frame>
  )
}

export function StegoVisual() {
  const cells = []
  for (let r = 0; r < 6; r++)
    for (let c = 0; c < 7; c++) {
      const v = (r * 7 + c) % 5
      cells.push(
        <rect
          key={r + '-' + c}
          x={66 + c * 18}
          y={56 + r * 18}
          width={14}
          height={14}
          fill={v === 0 ? 'rgba(201,154,75,0.6)' : v === 1 ? 'rgba(92,131,116,0.4)' : 'rgba(238,231,216,0.07)'}
        />,
      )
    }
  const t = (x: number, y: number, txt: string, fill: string) => (
    <text key={y} x={x} y={y} fontFamily={MONO} fontSize={9} fill={fill} letterSpacing="0.04em">
      {txt}
    </text>
  )
  return (
    <Frame>
      <Grid w={400} h={300} s={20} c="rgba(92,131,116,0.06)" />
      <rect x={60} y={50} width={140} height={120} fill="rgba(21,34,56,0.8)" stroke="rgba(92,131,116,0.5)" strokeWidth={1.5} />
      {cells}
      <text x={130} y={186} textAnchor="middle" fontFamily={MONO} fontSize={9} fill="rgba(201,154,75,0.6)">
        STEGO-IMAGE
      </text>
      <rect x={220} y={50} width={120} height={100} fill="rgba(21,34,56,0.8)" stroke="rgba(201,154,75,0.4)" strokeWidth={1.5} strokeDasharray="4 3" />
      {t(228, 70, 'DETECTING...', 'rgba(92,131,116,0.8)')}
      {t(228, 88, 'SRNet active', 'rgba(238,231,216,0.5)')}
      {t(228, 106, 'BossBase db', 'rgba(238,231,216,0.5)')}
      {t(228, 124, '⚠ HIDDEN DATA', 'rgba(201,154,75,0.9)')}
      {t(228, 138, 'BLOCKED', 'rgba(201,154,75,0.7)')}
      <line x1={200} y1={110} x2={220} y2={100} stroke="rgba(92,131,116,0.5)" strokeWidth={1.2} strokeDasharray="5 3" />
      <rect x={60} y={195} width={280} height={60} rx={8} fill="rgba(21,34,56,0.7)" stroke="rgba(92,131,116,0.3)" />
      {t(75, 215, 'WhatsApp-style interface', 'rgba(238,231,216,0.5)')}
      {t(75, 233, 'Real-time download detection', 'rgba(92,131,116,0.7)')}
      {t(75, 248, 'PyTorch · SRNet · BossBase dataset', 'rgba(201,154,75,0.5)')}
      <Label y={292} c="rgba(92,131,116,0.4)" t="STEGANALYSIS · ML SECURITY" />
    </Frame>
  )
}

export function TrafficVisual() {
  const cars = [
    { x: 50, y: 95, w: 60, h: 35, col: 'rgba(92,131,116,0.4)' },
    { x: 170, y: 170, w: 65, h: 35, col: 'rgba(92,131,116,0.35)' },
    { x: 300, y: 100, w: 58, h: 32, col: 'rgba(92,131,116,0.38)' },
  ]
  const dashes: number[] = []
  for (let x = 0; x < 400; x += 30) dashes.push(x)
  return (
    <Frame>
      <rect width={400} height={300} fill="rgba(11,18,32,0.5)" />
      <rect y={80} width={400} height={140} fill="rgba(20,30,45,0.9)" />
      {dashes.map((x) => (
        <line key={x} x1={x} y1={150} x2={x + 18} y2={150} stroke="rgba(238,231,216,0.12)" strokeWidth={2} />
      ))}
      <line x1={0} y1={80} x2={400} y2={80} stroke="rgba(238,231,216,0.15)" strokeWidth={1.5} />
      <line x1={0} y1={220} x2={400} y2={220} stroke="rgba(238,231,216,0.15)" strokeWidth={1.5} />
      {cars.map((c, i) => {
        const p = 8
        const bx = c.x - p
        const by = c.y - p
        const bw = c.w + p * 2
        const bh = c.h + p * 2
        const k = 8
        return (
          <g key={i}>
            <rect x={c.x} y={c.y} width={c.w} height={c.h} rx={4} fill={c.col} stroke="rgba(92,131,116,0.7)" />
            <rect x={c.x + c.w * 0.2} y={c.y + 4} width={c.w * 0.55} height={c.h * 0.45} rx={2} fill="rgba(238,231,216,0.08)" stroke="rgba(238,231,216,0.15)" strokeWidth={0.7} />
            <circle cx={c.x + 10} cy={c.y + c.h} r={5} fill="rgba(21,34,56,0.9)" stroke="rgba(92,131,116,0.5)" />
            <circle cx={c.x + c.w - 10} cy={c.y + c.h} r={5} fill="rgba(21,34,56,0.9)" stroke="rgba(92,131,116,0.5)" />
            <rect x={bx} y={by} width={bw} height={bh} fill="none" stroke="#c99a4b" strokeWidth={1.4} />
            {[
              `${bx + k},${by} ${bx},${by} ${bx},${by + k}`,
              `${bx + bw - k},${by} ${bx + bw},${by} ${bx + bw},${by + k}`,
              `${bx},${by + bh - k} ${bx},${by + bh} ${bx + k},${by + bh}`,
              `${bx + bw - k},${by + bh} ${bx + bw},${by + bh} ${bx + bw},${by + bh - k}`,
            ].map((pts) => (
              <polyline key={pts} points={pts} fill="none" stroke="#c99a4b" strokeWidth={1.8} />
            ))}
          </g>
        )
      })}
      <rect x={42} y={67} width={68} height={16} rx={2} fill="rgba(201,154,75,0.9)" />
      <text x={76} y={78} textAnchor="middle" fontFamily={MONO} fontSize={8.5} fontWeight="bold" fill="#0b1220">
        CAR 0.94
      </text>
      <Label y={290} c="rgba(201,154,75,0.5)" t="YOLO OBJECT DETECTION · TRAFFIC" />
    </Frame>
  )
}

export function GenericVisual({ label }: { label: string }) {
  return (
    <Frame>
      <Grid w={400} h={300} s={24} />
      <rect x={110} y={80} width={180} height={120} rx={4} fill="rgba(15,26,44,0.5)" stroke="rgba(201,154,75,0.45)" strokeWidth={1.5} strokeDasharray="6 4" />
      <path d="M130 180 l40 -45 28 30 22 -22 50 37 z" fill="rgba(92,131,116,0.18)" stroke="rgba(92,131,116,0.6)" strokeWidth={1.2} />
      <circle cx={250} cy={112} r={9} fill="rgba(201,154,75,0.18)" stroke="#c99a4b" strokeWidth={1.2} />
      <Label y={250} c="rgba(201,154,75,0.55)" t={(label || 'PROJECT').toUpperCase().slice(0, 34)} />
    </Frame>
  )
}

export function Avatar() {
  return (
    <svg width="220" height="220" viewBox="0 0 220 220" aria-label="avatar">
      <circle cx="110" cy="110" r="104" fill="#0f1a2c" stroke="#c99a4b" strokeWidth="2.5" />
      <circle cx="110" cy="90" r="44" fill="#152238" />
      <ellipse cx="110" cy="185" rx="66" ry="46" fill="#152238" />
      <text x="110" y="104" textAnchor="middle" dominantBaseline="middle" fontFamily="'Space Grotesk',sans-serif" fontWeight="700" fontSize="38" fill="#c99a4b" letterSpacing="2">
        SMS
      </text>
      <circle cx="110" cy="90" r="44" fill="none" stroke="#c99a4b" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.4" />
    </svg>
  )
}

export const VISUAL_KINDS = ['jewellery', 'wardhub', 'schoolzone', 'stego', 'traffic', 'generic'] as const

export function ProjectIllustration({ kind, title }: { kind: string; title: string }) {
  switch (kind) {
    case 'jewellery':
      return <JewelleryVisual />
    case 'wardhub':
      return <WardHubVisual />
    case 'schoolzone':
      return <SchoolZoneVisual />
    case 'stego':
      return <StegoVisual />
    case 'traffic':
      return <TrafficVisual />
    default:
      return <GenericVisual label={title} />
  }
}
