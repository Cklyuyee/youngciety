// Subject glyphs — big illustrative marks for the 4 core subjects
// Each subject uses a distinct earthy accent color

export type Subject = 'math' | 'thai' | 'english' | 'coding'

const palettes: Record<Subject, { ink: string; soft: string; pop: string }> = {
  math:    { ink: '#3F5D33', soft: 'var(--sage-soft)',    pop: 'var(--sage)' },
  thai:    { ink: '#75561A', soft: 'var(--mustard-soft)', pop: 'var(--mustard)' },
  english: { ink: '#345070', soft: 'var(--sky-soft)',     pop: 'var(--sky)' },
  coding:  { ink: '#5B3855', soft: 'var(--plum-soft)',    pop: 'var(--plum)' },
}

interface SubjectGlyphProps {
  subject: Subject
  size?: number
  showBg?: boolean
}

export function SubjectGlyph({ subject, size = 64, showBg = true }: SubjectGlyphProps) {
  const W = size
  const p = palettes[subject]

  const inner: Record<Subject, React.ReactNode> = {
    math: (
      <g>
        <text x="50%" y="56%" textAnchor="middle"
          fontFamily="var(--yct-display)" fontSize={W * 0.62} fontWeight="380"
          fill={p.ink} dominantBaseline="middle"
          style={{ fontVariationSettings: '"opsz" 72' }}>7</text>
        <circle cx={W * 0.78} cy={W * 0.28} r={W * 0.07} fill={p.pop} />
        <path d={`M ${W*.2} ${W*.78} L ${W*.32} ${W*.78}`} stroke={p.pop} strokeWidth={W * .04} strokeLinecap="round" />
        <path d={`M ${W*.26} ${W*.72} L ${W*.26} ${W*.84}`} stroke={p.pop} strokeWidth={W * .04} strokeLinecap="round" />
      </g>
    ),
    thai: (
      <g>
        <text x="50%" y="60%" textAnchor="middle"
          fontFamily="var(--yct-sans)" fontSize={W * 0.66} fontWeight="500"
          fill={p.ink} dominantBaseline="middle">ก</text>
        <circle cx={W * 0.22} cy={W * 0.28} r={W * 0.05} fill={p.pop} />
      </g>
    ),
    english: (
      <g>
        <text x="50%" y="58%" textAnchor="middle"
          fontFamily="var(--yct-display)" fontSize={W * 0.56} fontWeight="400"
          fill={p.ink} dominantBaseline="middle"
          style={{ fontVariationSettings: '"opsz" 72' }}>Aa</text>
      </g>
    ),
    coding: (
      <g>
        <path d={`M ${W*.28} ${W*.32} L ${W*.18} ${W*.5} L ${W*.28} ${W*.68}`}
          stroke={p.ink} strokeWidth={W * .06} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d={`M ${W*.72} ${W*.32} L ${W*.82} ${W*.5} L ${W*.72} ${W*.68}`}
          stroke={p.ink} strokeWidth={W * .06} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d={`M ${W*.58} ${W*.28} L ${W*.42} ${W*.72}`}
          stroke={p.pop} strokeWidth={W * .06} strokeLinecap="round" />
      </g>
    ),
  }

  return (
    <svg viewBox={`0 0 ${W} ${W}`} width={W} height={W} aria-hidden="true">
      {showBg && <rect x="0" y="0" width={W} height={W} rx={W * 0.22} fill={p.soft} />}
      {inner[subject]}
    </svg>
  )
}
