import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'

type BadgeSize = 'sm' | 'md' | 'lg'

interface StarBadgeProps {
  count: number
  max?: number
  size?: BadgeSize
  animated?: boolean
  className?: string
}

interface XPBadgeProps {
  xp: number
  size?: BadgeSize
  animated?: boolean
  className?: string
}

const starSize: Record<BadgeSize, string> = {
  sm: 'text-[18px]',
  md: 'text-[28px]',
  lg: 'text-[40px]',
}

const labelSize: Record<BadgeSize, string> = {
  sm: 'text-[11px]',
  md: 'text-[14px]',
  lg: 'text-[18px]',
}

export function StarBadge({ count, max = 3, size = 'md', animated = true, className }: StarBadgeProps) {
  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {Array.from({ length: max }).map((_, i) => (
        <motion.span
          key={i}
          className={cn(starSize[size], i < count ? 'text-accent-yellow' : 'text-neutral-200')}
          initial={animated && i < count ? { scale: 0, rotate: -30 } : {}}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: i * 0.15, type: 'spring', stiffness: 300, damping: 15 }}
        >
          ★
        </motion.span>
      ))}
    </div>
  )
}

export function XPBadge({ xp, size = 'md', animated = true, className }: XPBadgeProps) {
  return (
    <motion.div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-bold',
        'bg-[#FEF9C3] text-[#854D0E] border border-[#FDE047]',
        size === 'sm' ? 'px-2.5 py-1 text-[12px]' :
        size === 'md' ? 'px-3 py-1.5 text-[14px]' :
                        'px-4 py-2 text-[18px]',
        className,
      )}
      initial={animated ? { scale: 0 } : {}}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
    >
      <span className={size === 'lg' ? 'text-[20px]' : 'text-[16px]'}>⚡</span>
      +{xp} XP
    </motion.div>
  )
}

/* ── Coin Badge ── */
interface CoinBadgeProps {
  count: number
  size?: BadgeSize
  className?: string
}

export function CoinBadge({ count, size = 'md', className }: CoinBadgeProps) {
  return (
    <div className={cn(
      'inline-flex items-center gap-1.5 rounded-full font-bold',
      'bg-[#FFF7ED] text-[#92400E] border border-[#FCD34D]',
      size === 'sm' ? 'px-2.5 py-1 text-[12px]' :
      size === 'md' ? 'px-3 py-1.5 text-[14px]' :
                      'px-4 py-2 text-[18px]',
      className,
    )}>
      <span className={cn(labelSize[size])}>🪙</span>
      {count.toLocaleString()}
    </div>
  )
}
