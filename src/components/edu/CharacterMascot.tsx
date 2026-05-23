import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/cn'

export type MascotMood = 'happy' | 'thinking' | 'excited' | 'sad' | 'default'

interface CharacterMascotProps {
  mood?: MascotMood
  speech?: string
  size?: 'sm' | 'md' | 'lg'
  flip?: boolean    // face left
  className?: string
}

const moodEmoji: Record<MascotMood, string> = {
  happy:    '😊', thinking: '🤔', excited: '🤩', sad: '😢', default: '😐',
}

/* Inline chicken SVG (the one we made!) scaled by size */
const sizeMap = { sm: 80, md: 120, lg: 180 }

function ChickenSVG({ size }: { size: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size * 215 / 200}
      viewBox="0 0 200 215" fill="none">
      <ellipse cx="43" cy="100" rx="30" ry="11" fill="#FEBBF7" stroke="#1a1a1a" strokeWidth="2.5" transform="rotate(-48 43 100)"/>
      <ellipse cx="37" cy="120" rx="30" ry="11" fill="#FFF5ED" stroke="#1a1a1a" strokeWidth="2.5" transform="rotate(-5 37 120)"/>
      <ellipse cx="43" cy="141" rx="30" ry="11" fill="#FEBBF7" stroke="#1a1a1a" strokeWidth="2.5" transform="rotate(38 43 141)"/>
      <line x1="90" y1="180" x2="86" y2="203" stroke="#F47820" strokeWidth="7" strokeLinecap="round"/>
      <line x1="118" y1="180" x2="122" y2="203" stroke="#F47820" strokeWidth="7" strokeLinecap="round"/>
      <line x1="86" y1="203" x2="67" y2="211" stroke="#F47820" strokeWidth="5" strokeLinecap="round"/>
      <line x1="86" y1="203" x2="84" y2="214" stroke="#F47820" strokeWidth="5" strokeLinecap="round"/>
      <line x1="86" y1="203" x2="103" y2="211" stroke="#F47820" strokeWidth="5" strokeLinecap="round"/>
      <line x1="122" y1="203" x2="103" y2="211" stroke="#F47820" strokeWidth="5" strokeLinecap="round"/>
      <line x1="122" y1="203" x2="120" y2="214" stroke="#F47820" strokeWidth="5" strokeLinecap="round"/>
      <line x1="122" y1="203" x2="139" y2="211" stroke="#F47820" strokeWidth="5" strokeLinecap="round"/>
      <ellipse cx="105" cy="130" rx="60" ry="52" fill="white" stroke="#1a1a1a" strokeWidth="3"/>
      <ellipse cx="94" cy="133" rx="32" ry="21" fill="#F8F8F8" stroke="#1a1a1a" strokeWidth="2" transform="rotate(-10 94 133)"/>
      <circle cx="148" cy="72" r="30" fill="white" stroke="#1a1a1a" strokeWidth="3"/>
      <path d="M132,52 L132,44 Q136,28 142,44 Q146,24 152,42 Q157,18 163,40 L163,52 Z" fill="#FF44CB" stroke="#1a1a1a" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/>
      <ellipse cx="160" cy="99" rx="8" ry="11" fill="#FF44CB" stroke="#1a1a1a" strokeWidth="2"/>
      <polygon points="174,65 192,72 174,79" fill="#F47820" stroke="#1a1a1a" strokeWidth="2.5" strokeLinejoin="round"/>
      <circle cx="162" cy="63" r="9" fill="white" stroke="#1a1a1a" strokeWidth="2"/>
      <circle cx="164" cy="62" r="5" fill="#1a1a1a"/>
      <circle cx="166" cy="60" r="2" fill="white"/>
    </svg>
  )
}

export function CharacterMascot({
  mood = 'happy', speech, size = 'md', flip = false, className,
}: CharacterMascotProps) {
  const px = sizeMap[size]

  const bobAnimation = {
    y: [0, -6, 0],
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
  }

  const excitedAnimation = {
    y: [0, -10, 0, -8, 0],
    rotate: [-3, 3, -3, 3, 0],
    transition: { duration: 0.6, repeat: Infinity },
  }

  const sadAnimation = {
    y: [0, 2, 0],
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
  }

  const anim = mood === 'excited' ? excitedAnimation :
               mood === 'sad'     ? sadAnimation : bobAnimation

  return (
    <div className={cn('flex flex-col items-center gap-3', className)}>
      {/* Speech bubble */}
      <AnimatePresence>
        {speech && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 6 }}
            className={cn(
              'relative max-w-[220px] bg-white border-2 border-neutral-300',
              'rounded-[var(--radius-sm)] px-4 py-3 shadow-[var(--shadow-sm)]',
              'text-[14px] font-bold text-neutral-900 text-center leading-snug',
            )}
          >
            {speech}
            {/* Bubble tail */}
            <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-[16px]">▼</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Character */}
      <motion.div
        animate={anim}
        style={{ scaleX: flip ? -1 : 1 }}
        className="cursor-pointer"
      >
        <ChickenSVG size={px} />
      </motion.div>

      {/* Mood emoji */}
      {mood !== 'default' && (
        <motion.span
          className="text-[24px] select-none"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          {moodEmoji[mood]}
        </motion.span>
      )}
    </div>
  )
}
