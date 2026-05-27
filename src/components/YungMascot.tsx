import { useId, useState, useRef } from 'react'

// "ยัง" (Yung) — Youngciety mascot v3 (Kawaii edition)
// Design: cream egg with kawaii face — big round eyes with double highlights,
// pulsing pink blush, expressive W-smile mouth, sprout on top.
//
// Mood maps:
//   default  → calm closed-mouth W
//   happy    → W-smile (default friendly state)
//   cheer    → wide open laughing mouth (celebration)
//   thinking → small concerned mouth + slight head tilt
//   sad      → downward curve mouth + droopy eyes
//
// Interactive mode (opt-in): set `interactive` prop → click/tap plays a
// cute pop sound, shows the cheer mouth, and triggers a giggle animation
// (~0.55s). Returns to current mood after.

export type MascotMood = 'default' | 'happy' | 'thinking' | 'cheer' | 'sad'

interface MascotProps {
  size?: number
  mood?: MascotMood
  className?: string
  style?: React.CSSProperties
  /** Make the mascot clickable — adds pointer cursor, pop sound + giggle animation */
  interactive?: boolean
  /** Called after click reaction starts (use for extra effects like particle bursts) */
  onClick?: () => void
}

export function YungMascot({
  size = 88,
  mood = 'default',
  className = '',
  style = {},
  interactive = false,
  onClick,
}: MascotProps) {
  /* Unique IDs so multiple mascots on the page don't share gradients/animations */
  const rawId = useId().replace(/[^a-zA-Z0-9]/g, '')
  const gradId    = `eggGrad-${rawId}`
  const shadowId  = `shadow-${rawId}`
  const eyeClass  = `eye-${rawId}`
  const blushCls  = `blush-${rawId}`
  const giggleCls = `giggle-${rawId}`

  /* Click reaction state */
  const [isReacting, setIsReacting] = useState(false)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const reactTimerRef = useRef<number | null>(null)

  /* Override mood during reaction to show the cheer expression */
  const effectiveMood: MascotMood = isReacting ? 'cheer' : mood

  const showHappy    = effectiveMood === 'happy'    || effectiveMood === 'default'
  const showCheer    = effectiveMood === 'cheer'
  const showThinking = effectiveMood === 'thinking'
  const showSad      = effectiveMood === 'sad'

  /* Eyes shape — slightly droopy/smaller for sad, slightly squinted for cheer */
  const eyeRy = showSad ? 7 : showCheer ? 7.5 : 10

  function playPop() {
    try {
      if (!audioCtxRef.current) {
        const W = window as Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext }
        const AC = window.AudioContext || W.webkitAudioContext
        if (AC) audioCtxRef.current = new AC()
      }
      const ac = audioCtxRef.current
      if (!ac) return
      const osc = ac.createOscillator()
      const gain = ac.createGain()
      osc.connect(gain); gain.connect(ac.destination)
      osc.type = 'sine'
      const now = ac.currentTime
      osc.frequency.setValueAtTime(380, now)
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15)
      gain.gain.setValueAtTime(0.22, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2)
      osc.start(now); osc.stop(now + 0.2)
    } catch { /* ignore audio errors */ }
  }

  function handleClick(e: React.MouseEvent | React.KeyboardEvent) {
    if (!interactive || isReacting) return
    e.stopPropagation()
    setIsReacting(true)
    playPop()
    if (reactTimerRef.current) window.clearTimeout(reactTimerRef.current)
    reactTimerRef.current = window.setTimeout(() => setIsReacting(false), 600)
    onClick?.()
  }

  return (
    <svg
      viewBox="0 0 400 400"
      width={size}
      height={size}
      className={className}
      style={{
        ...style,
        cursor: interactive ? 'pointer' : (style as React.CSSProperties).cursor,
        userSelect: interactive ? 'none' : undefined,
        WebkitTapHighlightColor: 'transparent',
      }}
      onClick={interactive ? handleClick : undefined}
      onKeyDown={interactive ? (e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(e) } : undefined}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label={interactive ? 'จิ้มน้องยังเล่น' : undefined}
      aria-hidden={!interactive}
    >
      <defs>
        <filter id={shadowId} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="12" stdDeviation="10" floodColor="#C9876A" floodOpacity="0.25" />
        </filter>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"  stopColor="#FFFFFF" />
          <stop offset="85%" stopColor="#FFFDF0" />
          <stop offset="100%" stopColor="#F2E6CE" />
        </linearGradient>
      </defs>

      {/* Scoped animations — only affect children inside THIS SVG instance */}
      <style>{`
        @keyframes blink-${rawId} {
          0%, 92%, 100% { transform: scaleY(1); }
          96% { transform: scaleY(0.1); }
        }
        @keyframes blush-${rawId} {
          0%, 100% { opacity: 0.55; transform: scale(1); }
          50%      { opacity: 0.80; transform: scale(1.10); }
        }
        @keyframes giggle-${rawId} {
          0%, 100% { transform: scale(1, 1)         rotate(0deg); }
          25%      { transform: scale(1.08, 0.92)   rotate(-3deg); }
          50%      { transform: scale(0.94, 1.08)   rotate(3deg); }
          75%      { transform: scale(1.04, 0.96)   rotate(-1.5deg); }
        }
        .${eyeClass}   { transform-origin: center; transform-box: fill-box; animation: blink-${rawId} 4.5s infinite; }
        .${blushCls}   { transform-origin: center; transform-box: fill-box; animation: blush-${rawId} 2.4s ease-in-out infinite; }
        .${giggleCls}  { transform-origin: 200px 350px; transform-box: view-box; animation: giggle-${rawId} 0.55s ease-in-out; }
      `}</style>

      {/* Floor shadow ellipse — stays still */}
      <ellipse cx="200" cy="372" rx="78" ry="9" fill="rgba(31,27,22,.18)" />

      {/* Everything inside this group reacts to the giggle animation */}
      <g className={isReacting ? giggleCls : ''}>

        {/* Egg shell body */}
        <path
          d="M 200,60 C 120,60 90,160 90,240 C 90,310 135,350 200,350 C 265,350 310,310 310,240 C 310,160 280,60 200,60 Z"
          fill={`url(#${gradId})`}
          stroke="rgba(110,80,50,.32)"
          strokeWidth="1.5"
          filter={`url(#${shadowId})`}
        />

        {/* Subtle bottom shading for 3D feel */}
        <path
          d="M 110 250 C 120 305, 145 340, 200 340 C 255 340, 280 305, 290 250 C 280 290, 245 310, 200 310 C 155 310, 120 290, 110 250 Z"
          fill="#EEDFC1"
          opacity="0.55"
        />

        {/* Specular highlight top-left */}
        <ellipse cx="142" cy="148" rx="22" ry="42" fill="#FFFFFF" opacity="0.7" transform="rotate(-18 142 148)" />

        {/* Sprout on top — stem + 2 leaves */}
        <g transform="translate(200, 60)">
          <path d="M 0,0 Q -2,-18 -10,-24" fill="none" stroke="#5b7a3c" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M -10,-24 C -18,-28 -22,-20 -10,-24 Z" fill="var(--sage, #7C9A6B)" stroke="#3F5D33" strokeWidth="1.4" />
          <path d="M -8,-20 C -4,-28 6,-24 -8,-20 Z" fill="#9EBA88" stroke="#3F5D33" strokeWidth="1.4" />
        </g>

        {/* Face group */}
        <g transform="translate(0, 12)">

          {/* Blush ovals — pulse */}
          <ellipse className={blushCls} cx="150" cy="222" rx="16" ry="9" fill="#FFA3A5" opacity="0.6" />
          <ellipse className={blushCls} cx="250" cy="222" rx="16" ry="9" fill="#FFA3A5" opacity="0.6" />

          {/* Left eye + highlights */}
          <g transform="translate(165, 200)">
            {showSad ? (
              <ellipse cx="0" cy="2" rx="8" ry={eyeRy} fill="#2D251E" transform="rotate(-15)" />
            ) : (
              <ellipse className={eyeClass} cx="0" cy="0" rx="9" ry={eyeRy} fill="#2D251E" />
            )}
            <circle cx="-3" cy="-3" r="3"   fill="#FFFFFF" />
            <circle cx="3"  cy="3"  r="1.5" fill="#FFFFFF" />
          </g>

          {/* Right eye + highlights */}
          <g transform="translate(235, 200)">
            {showSad ? (
              <ellipse cx="0" cy="2" rx="8" ry={eyeRy} fill="#2D251E" transform="rotate(15)" />
            ) : (
              <ellipse className={eyeClass} cx="0" cy="0" rx="9" ry={eyeRy} fill="#2D251E" />
            )}
            <circle cx="-3" cy="-3" r="3"   fill="#FFFFFF" />
            <circle cx="3"  cy="3"  r="1.5" fill="#FFFFFF" />
          </g>

          {/* Mouth — switched by mood */}
          {showHappy && (
            <path d="M 188 222 Q 194 230 200 222 Q 206 230 212 222"
              fill="none" stroke="#2D251E" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
          )}
          {showCheer && (
            <>
              <path d="M 185 218 Q 200 218 215 218 Q 200 244 185 218 Z"
                fill="#FF7B93" stroke="#2D251E" strokeWidth="3.2" strokeLinejoin="round" />
              <path d="M 197 234 Q 200 240 203 234"
                fill="#FF4D74" stroke="#2D251E" strokeWidth="2" strokeLinecap="round" />
            </>
          )}
          {showThinking && (
            <path d="M 190 226 Q 200 222 210 226"
              fill="none" stroke="#2D251E" strokeWidth="4" strokeLinecap="round" />
          )}
          {showSad && (
            <path d="M 188 232 Q 200 220 212 232"
              fill="none" stroke="#2D251E" strokeWidth="4.5" strokeLinecap="round" />
          )}
        </g>

        {/* Cheer-only: raised arms */}
        {showCheer && (
          <g>
            <path d="M 95 170 Q 70 130 80 95"  stroke="#F2E6CE" strokeWidth="14" fill="none" strokeLinecap="round" />
            <path d="M 305 170 Q 330 130 320 95" stroke="#F2E6CE" strokeWidth="14" fill="none" strokeLinecap="round" />
            <circle cx="80"  cy="95" r="11" fill="#FFFDF0" stroke="rgba(110,80,50,.35)" strokeWidth="1" />
            <circle cx="320" cy="95" r="11" fill="#FFFDF0" stroke="rgba(110,80,50,.35)" strokeWidth="1" />
          </g>
        )}
      </g>
    </svg>
  )
}
