import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'
import { cn } from '@/lib/cn'

export interface LevelNode {
  id: number
  title: string
  status: 'completed' | 'current' | 'locked'
  stars?: number     // 0–3
  icon?: string      // emoji
}

interface LevelMapProps {
  levels: LevelNode[]
  onSelect?: (id: number) => void
  className?: string
}

const nodeStyle: Record<LevelNode['status'], {
  outer: string; inner: string; label: string; ring: string
}> = {
  completed: {
    outer: 'bg-[#22C55E] border-[#16A34A]',
    inner: 'text-white',
    label: 'text-neutral-700',
    ring:  'ring-[#BBF7D0]',
  },
  current: {
    outer: 'bg-brand-pink border-[#CC2E96]',
    inner: 'text-white',
    label: 'text-brand-pink font-black',
    ring:  'ring-[#FEBBF7]',
  },
  locked: {
    outer: 'bg-neutral-200 border-neutral-300',
    inner: 'text-neutral-400',
    label: 'text-neutral-400',
    ring:  '',
  },
}

// Zigzag X positions for a winding-path feel
const zigzag = [50, 70, 50, 30, 50, 70, 50, 30]

export function LevelMap({ levels, onSelect, className }: LevelMapProps) {
  return (
    <div className={cn('relative w-full max-w-[320px] mx-auto', className)}>
      {levels.map((level, i) => {
        const s = nodeStyle[level.status]
        const xPct = zigzag[i % zigzag.length]
        const isLast = i === levels.length - 1

        return (
          <div key={level.id} className="relative">
            {/* Connector line to next node */}
            {!isLast && (
              <div
                className="absolute left-0 right-0 flex justify-center"
                style={{ top: '64px', height: '48px', left: `${xPct}%`, transform: 'translateX(-50%)', width: '4px' }}
              >
                <div className={cn(
                  'w-full h-full rounded-full',
                  level.status === 'locked' ? 'bg-neutral-200' : 'bg-[#BBF7D0]',
                )} />
              </div>
            )}

            {/* Node */}
            <div
              className="relative flex items-center gap-4 pb-12"
              style={{ paddingLeft: `${xPct}%`, transform: 'translateX(-50%)', width: 'fit-content', marginLeft: '50%' }}
            >
              <motion.button
                onClick={() => level.status !== 'locked' && onSelect?.(level.id)}
                whileHover={level.status !== 'locked' ? { scale: 1.1 } : {}}
                whileTap={level.status !== 'locked' ? { scale: 0.95 } : {}}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.1, type: 'spring', stiffness: 280, damping: 18 }}
                className={cn(
                  'relative flex items-center justify-center',
                  'w-16 h-16 rounded-full border-4 shadow-[var(--shadow-sm)]',
                  level.status !== 'locked' ? 'cursor-pointer' : 'cursor-not-allowed',
                  level.status === 'current' ? 'ring-4 ring-offset-2' : '',
                  s.outer, s.ring,
                )}
              >
                {level.status === 'locked'
                  ? <Lock size={20} className="text-neutral-400" />
                  : <span className={cn('text-[26px] leading-none', s.inner)}>
                      {level.icon ?? level.id}
                    </span>
                }

                {/* Current pulse */}
                {level.status === 'current' && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-brand-pink opacity-30"
                    animate={{ scale: [1, 1.5], opacity: [0.3, 0] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  />
                )}
              </motion.button>

              {/* Label beside node */}
              <div className="absolute left-[72px] top-1/2 -translate-y-1/2 whitespace-nowrap">
                <p className={cn('text-[13px] font-bold', s.label)}>{level.title}</p>
                {level.status === 'completed' && level.stars != null && (
                  <div className="flex gap-0.5 mt-0.5">
                    {[0, 1, 2].map(j => (
                      <span key={j} className={j < (level.stars ?? 0) ? 'text-accent-yellow text-[12px]' : 'text-neutral-300 text-[12px]'}>★</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
