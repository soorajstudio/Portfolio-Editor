export const ICON_NAMES = ['award', 'monitor', 'grid', 'chat', 'star', 'trophy', 'doc', 'code', 'globe'] as const

export function Icon({ name, className }: { name: string; className?: string }) {
  const p = { className, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.3 } as const
  switch (name) {
    case 'monitor':
      return (
        <svg {...p}>
          <rect x="3" y="4" width="18" height="14" rx="1" />
          <path d="M8 21h8M12 18v3" />
        </svg>
      )
    case 'grid':
      return (
        <svg {...p}>
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" strokeDasharray="2 2" />
        </svg>
      )
    case 'chat':
      return (
        <svg {...p}>
          <path d="M4 4h16v12H8l-4 4V4z" />
        </svg>
      )
    case 'star':
      return (
        <svg {...p}>
          <polygon points="12 2 14.5 9 22 9 16 14 18.5 21 12 17 5.5 21 8 14 2 9 9.5 9" />
        </svg>
      )
    case 'trophy':
      return (
        <svg {...p}>
          <path d="M8 21h8M12 17v4" />
          <path d="M5 3h14l-2 9H7L5 3z" />
          <path d="M7 12c0 2.76 2.24 5 5 5s5-2.24 5-5" />
        </svg>
      )
    case 'doc':
      return (
        <svg {...p}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      )
    case 'code':
      return (
        <svg {...p}>
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      )
    case 'globe':
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" />
        </svg>
      )
    default: // award
      return (
        <svg {...p}>
          <circle cx="12" cy="8" r="5" />
          <path d="M8 13l-2 8 6-3 6 3-2-8" />
        </svg>
      )
  }
}
