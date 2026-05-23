// Youngciety Logo — wordmark + logomark
// The mark is a "Y" read as a sprouting seed;
// two branches open upward like a leaf pair,
// a dot sits between them like a sun.

interface LogoMarkProps {
  size?: number
  accent?: string
  inkColor?: string
}

export function YungLogoMark({ size = 28, accent = 'var(--rust)', inkColor = 'var(--ink-900)' }: LogoMarkProps) {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} aria-hidden="true">
      {/* Y stem */}
      <path d="M 20 38 L 20 22" stroke={inkColor} strokeWidth="3" strokeLinecap="round" fill="none" />
      {/* Y branches */}
      <path d="M 20 22 L 8 8"   stroke={inkColor} strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M 20 22 L 32 8"  stroke={inkColor} strokeWidth="3" strokeLinecap="round" fill="none" />
      {/* Sun / dot between branches */}
      <circle cx="20" cy="12" r="3.6" fill={accent} />
    </svg>
  )
}

interface LogoProps {
  size?: number
  color?: string
  accent?: string
  showWordmark?: boolean
}

export function YungLogo({ size = 28, color = 'var(--ink-900)', accent = 'var(--rust)', showWordmark = true }: LogoProps) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
      <YungLogoMark size={size} accent={accent} inkColor={color} />
      {showWordmark && (
        <span style={{
          fontFamily: 'var(--yct-display)',
          fontSize: size * 0.86,
          fontWeight: 420,
          color,
          letterSpacing: '-0.022em',
          fontVariationSettings: '"opsz" 36',
          lineHeight: 1,
        }}>
          Youngciety
        </span>
      )}
    </div>
  )
}
