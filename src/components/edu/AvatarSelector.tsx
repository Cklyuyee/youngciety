import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { cn } from '@/lib/cn'

export interface AvatarOption {
  id: string
  emoji: string
  name: string
  color: string   // bg color class e.g. 'bg-[#FFF0FA]'
  locked?: boolean
}

interface AvatarSelectorProps {
  avatars: AvatarOption[]
  selected: string
  onSelect: (id: string) => void
  columns?: 3 | 4 | 5
  className?: string
}

export function AvatarSelector({
  avatars, selected, onSelect,
  columns = 4, className,
}: AvatarSelectorProps) {
  const gridClass = {
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
  }[columns]

  return (
    <div className={cn(`grid gap-3 ${gridClass}`, className)}>
      {avatars.map((av, i) => {
        const isSelected = av.id === selected
        return (
          <motion.button
            key={av.id}
            onClick={() => !av.locked && onSelect(av.id)}
            whileTap={!av.locked ? { scale: 0.9 } : {}}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05, type: 'spring', stiffness: 300 }}
            className={cn(
              'relative flex flex-col items-center gap-1.5 p-3 rounded-[var(--radius-sm)]',
              'border-2 transition-all duration-200 cursor-pointer',
              av.locked && 'opacity-40 cursor-not-allowed grayscale',
              isSelected
                ? 'border-brand-pink shadow-[0_0_0_3px_rgba(255,68,203,0.2)]'
                : 'border-neutral-200 hover:border-neutral-400',
              av.color,
            )}
          >
            {/* Selected check */}
            <AnimatedCheck show={isSelected} />

            {/* Emoji */}
            <span className="text-[36px] leading-none">{av.emoji}</span>

            {/* Name */}
            <span className={cn(
              'text-[11px] font-bold text-center leading-tight',
              isSelected ? 'text-brand-pink' : 'text-neutral-600',
            )}>
              {av.name}
            </span>

            {/* Lock icon */}
            {av.locked && (
              <div className="absolute inset-0 flex items-center justify-center rounded-[var(--radius-sm)] bg-white/40">
                <span className="text-[20px]">🔒</span>
              </div>
            )}
          </motion.button>
        )
      })}
    </div>
  )
}

function AnimatedCheck({ show }: { show: boolean }) {
  if (!show) return null
  return (
    <motion.div
      className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-brand-pink flex items-center justify-center"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
    >
      <Check size={11} className="text-white" strokeWidth={3} />
    </motion.div>
  )
}
