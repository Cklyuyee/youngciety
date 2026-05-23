import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'

type ProgressColor = 'pink' | 'blue' | 'yellow' | 'green' | 'purple'
type ProgressSize  = 'sm' | 'md' | 'lg'

interface ProgressBarProps {
  value: number          // 0–100
  label?: string
  color?: ProgressColor
  size?: ProgressSize
  showPercent?: boolean
  animated?: boolean
}

const trackH: Record<ProgressSize, string> = {
  sm: 'h-3',
  md: 'h-5',
  lg: 'h-7',
}

const fillColor: Record<ProgressColor, string> = {
  pink:   'bg-brand-pink',
  blue:   'bg-accent-ocean-blue',
  yellow: 'bg-accent-yellow',
  green:  'bg-[#22C55E]',
  purple: 'bg-accent-purple',
}

export function ProgressBar({
  value,
  label,
  color = 'pink',
  size = 'md',
  showPercent = true,
  animated = true,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value))

  return (
    <div className="w-full">
      {(label || showPercent) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && (
            <span className="text-[13px] font-bold text-neutral-900">{label}</span>
          )}
          {showPercent && (
            <span className="text-[13px] font-bold text-neutral-600 ml-auto">
              {clamped}%
            </span>
          )}
        </div>
      )}
      <div className={cn('w-full rounded-full bg-neutral-100 overflow-hidden', trackH[size])}>
        <motion.div
          className={cn('h-full rounded-full', fillColor[color])}
          initial={animated ? { width: 0 } : { width: `${clamped}%` }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 0.8, ease: [0, 0, 0.58, 1] }}
        />
      </div>
    </div>
  )
}
