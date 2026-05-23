// "ยัง" (Yung) — Youngciety mascot v2
// Design: cream egg with sprout, tiny feet, blush cheeks, mood-based mouth.
// Cheer mode adds raised arms + tiny tooth.

export type MascotMood = 'default' | 'happy' | 'thinking' | 'cheer' | 'sad'

interface MascotProps {
  size?: number
  mood?: MascotMood
  className?: string
  style?: React.CSSProperties
}

export function YungMascot({ size = 88, mood = 'default', className = '', style = {} }: MascotProps) {
  const eyeY  = 64
  const eyeRy = (mood === 'happy' || mood === 'cheer') ? 2.4 : 3.8

  const mouth: Record<MascotMood, string> = {
    default:  'M 44 77 Q 52 82 60 77',
    happy:    'M 42 75 Q 52 88 62 75',
    thinking: 'M 46 80 Q 52 81 58 80',
    cheer:    'M 41 74 Q 52 90 63 74',
    sad:      'M 44 82 Q 52 76 60 82',
  }

  const shell          = '#FCF6E6'
  const shellHighlight = '#FFFFFF'
  const shellShadow    = '#EEDFC1'
  const shellEdge      = 'rgba(110,80,50,.55)'

  return (
    <svg
      viewBox="0 0 104 124"
      width={size}
      height={size * (124 / 104)}
      className={className}
      style={style}
      aria-hidden="true"
    >
      {/* ground shadow */}
      <ellipse cx="52" cy="119" rx="24" ry="2.8" fill="rgba(31,27,22,.14)" />

      {/* tiny rust feet */}
      <ellipse cx="42" cy="116" rx="6.5" ry="3.2" fill="var(--rust)" stroke="var(--rust-deep)" strokeWidth="0.6" />
      <ellipse cx="62" cy="116" rx="6.5" ry="3.2" fill="var(--rust)" stroke="var(--rust-deep)" strokeWidth="0.6" />

      {/* cheer arms */}
      {mood === 'cheer' && (
        <g>
          <path d="M 20 68 Q 8 46 16 28" stroke={shell} strokeWidth="7" fill="none" strokeLinecap="round" />
          <path d="M 84 68 Q 96 46 88 28" stroke={shell} strokeWidth="7" fill="none" strokeLinecap="round" />
          <circle cx="16" cy="28" r="5.5" fill={shell} stroke={shellEdge} strokeWidth="0.6" />
          <circle cx="88" cy="28" r="5.5" fill={shell} stroke={shellEdge} strokeWidth="0.6" />
        </g>
      )}

      {/* egg body */}
      <path
        d="M 52 12
           C 32 12, 20 30, 18 50
           C 16 72, 20 96, 34 108
           C 44 114, 60 114, 70 108
           C 84 96, 88 72, 86 50
           C 84 30, 72 12, 52 12 Z"
        fill={shell}
        stroke={shellEdge}
        strokeWidth="1.1"
      />

      {/* bottom shadow — gives 3D feel */}
      <path
        d="M 22 88 C 26 102, 38 112, 52 113 C 66 113, 78 105, 84 88 C 78 96, 64 102, 52 100 C 38 100, 28 96, 22 88 Z"
        fill={shellShadow}
        opacity="0.55"
      />

      {/* specular highlight top-left */}
      <ellipse cx="36" cy="44" rx="10" ry="22" fill={shellHighlight}
               transform="rotate(-18 36 44)" opacity="0.7" />

      {/* speckles */}
      <g fill="rgba(140,92,56,.35)">
        <circle cx="60" cy="38" r="0.9" />
        <circle cx="70" cy="56" r="0.7" />
        <circle cx="30" cy="76" r="1"   />
        <circle cx="50" cy="100" r="0.8" />
        <circle cx="74" cy="84" r="0.9" />
        <circle cx="64" cy="100" r="0.6" />
        <circle cx="28" cy="60" r="0.7" />
      </g>

      {/* crack at top + sprout */}
      <g>
        <path
          d="M 44 22 L 47 18 L 50 22 L 53 18 L 56 22 L 59 18 L 62 22"
          stroke={shellEdge} strokeWidth="1.4" fill="none"
          strokeLinejoin="miter" strokeLinecap="round" opacity="0.85"
        />
        {/* notch where sprout comes through */}
        <path d="M 49 18 L 51 14 L 55 14 L 57 18 Z" fill="var(--cream-100)" stroke={shellEdge} strokeWidth="0.7" />
        {/* sprout stem */}
        <path d="M 53 14 L 53 7" stroke="#5b4b34" strokeWidth="1.6" strokeLinecap="round" />
        {/* right leaf */}
        <path d="M 53 8 C 59 5, 63 6, 63 0 C 58 1, 54 3, 53 8 Z" fill="var(--sage)" stroke="#5d7a4d" strokeWidth="0.6" />
        {/* left leaf */}
        <path d="M 53 11 C 48 9, 45 10, 45 5 C 49 5, 52 7, 53 11 Z" fill="var(--sage)" opacity=".88" />
      </g>

      {/* eyes */}
      <g fill="#1F1B16" className="yct-blink" style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
        <ellipse cx="44" cy={eyeY} rx="3" ry={eyeRy} />
        <ellipse cx="60" cy={eyeY} rx="3" ry={eyeRy} />
      </g>
      {/* eye glints */}
      <circle cx="45.4" cy={eyeY - 1.8} r="1" fill="#fff" />
      <circle cx="61.4" cy={eyeY - 1.8} r="1" fill="#fff" />

      {/* cheek blush */}
      <ellipse cx="30"  cy={eyeY + 9} rx="5" ry="2.6" fill="rgba(217,119,87,.45)" />
      <ellipse cx="74"  cy={eyeY + 9} rx="5" ry="2.6" fill="rgba(217,119,87,.45)" />

      {/* mouth */}
      <path d={mouth[mood]} stroke="#1F1B16" strokeWidth="2.1" fill="none" strokeLinecap="round" />

      {/* cheer tooth */}
      {mood === 'cheer' && (
        <rect x="50.7" y="79" width="2.6" height="3.4" rx="0.6" fill="#fff" stroke="#1F1B16" strokeWidth="0.6" />
      )}
    </svg>
  )
}
