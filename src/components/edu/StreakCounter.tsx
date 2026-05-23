import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'

interface StreakCounterProps {
  days: number
  active?: boolean   // is today's streak done?
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

// Last 7 day dots
interface WeekDotsProps {
  activeDays: number   // how many of last 7 are done
}

export function StreakCounter({ days, active = true, size = 'md', className }: StreakCounterProps) {
  const flameSize = size === 'sm' ? 'text-[28px]' : size === 'md' ? 'text-[40px]' : 'text-[56px]'
  const countSize = size === 'sm' ? 'text-[22px]' : size === 'md' ? 'text-[32px]' : 'text-[48px]'
  const labelSize = size === 'sm' ? 'text-[11px]' : size === 'md' ? 'text-[13px]' : 'text-[16px]'

  return (
    <motion.div
      className={cn(
        'inline-flex flex-col items-center gap-1 select-none',
        !active && 'opacity-50',
        className,
      )}
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
    >
      <motion.span
        className={flameSize}
        animate={active ? { scale: [1, 1.15, 1] } : {}}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        🔥
      </motion.span>
      <span className={cn('font-black text-neutral-900 leading-none', countSize)}>
        {days}
      </span>
      <span className={cn('font-bold text-neutral-500', labelSize)}>
        วันติดต่อกัน
      </span>
    </motion.div>
  )
}

export function WeekDots({ activeDays }: WeekDotsProps) {
  const days = ['จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส', 'อา']

  return (
    <div className="flex gap-2 items-end">
      {days.map((d, i) => {
        const done = i < activeDays
        return (
          <div key={d} className="flex flex-col items-center gap-1">
            <motion.div
              className={cn(
                'w-9 h-9 rounded-full flex items-center justify-center text-[16px]',
                done
                  ? 'bg-brand-pink text-white shadow-[0_2px_8px_rgba(255,68,203,0.4)]'
                  : 'bg-neutral-100 text-neutral-400',
              )}
              initial={done ? { scale: 0 } : {}}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.07, type: 'spring', stiffness: 300 }}
            >
              {done ? '🔥' : '○'}
            </motion.div>
            <span className="text-[10px] font-bold text-neutral-500">{d}</span>
          </div>
        )
      })}
    </div>
  )
}
