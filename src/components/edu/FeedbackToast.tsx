import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/cn'

export type FeedbackType = 'correct' | 'incorrect' | 'xp' | 'levelup' | 'streak'

interface FeedbackToastProps {
  type: FeedbackType
  message?: string
  xp?: number
  visible: boolean
  onDone?: () => void
  duration?: number  // ms
}

const config: Record<FeedbackType, {
  emoji: string; bg: string; border: string; text: string; title: string
}> = {
  correct:   { emoji: '🎉', bg: 'bg-[#DCFCE7]', border: 'border-[#16A34A]', text: 'text-[#14532D]', title: 'ถูกต้อง!' },
  incorrect: { emoji: '😅', bg: 'bg-[#FEE2E2]', border: 'border-[#DC2626]', text: 'text-[#7F1D1D]', title: 'ลองใหม่นะ!' },
  xp:        { emoji: '⚡', bg: 'bg-[#FEF9C3]', border: 'border-[#CA8A04]', text: 'text-[#713F12]', title: 'ได้รับ XP!' },
  levelup:   { emoji: '🏆', bg: 'bg-[#EDE9FE]', border: 'border-[#7C3AED]', text: 'text-[#3B0764]', title: 'Level Up!' },
  streak:    { emoji: '🔥', bg: 'bg-[#FFF7ED]', border: 'border-[#EA580C]', text: 'text-[#7C2D12]', title: 'Streak!' },
}

export function FeedbackToast({
  type, message, xp, visible, onDone, duration = 2200,
}: FeedbackToastProps) {
  const c = config[type]

  useEffect(() => {
    if (!visible) return
    const t = setTimeout(() => onDone?.(), duration)
    return () => clearTimeout(t)
  }, [visible, duration, onDone])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={cn(
              'flex flex-col items-center gap-3 px-10 py-8 rounded-[var(--radius-sm)]',
              'border-2 shadow-[var(--shadow-lg)] pointer-events-auto',
              c.bg, c.border,
            )}
            initial={{ scale: 0.5, y: 40 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: -20, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 22 }}
          >
            {/* Emoji */}
            <motion.span
              className="text-[64px] leading-none"
              animate={{ rotate: [0, -10, 10, -8, 8, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {c.emoji}
            </motion.span>

            {/* Title */}
            <p className={cn('text-[28px] font-black', c.text)}>{c.title}</p>

            {/* XP reward */}
            {xp && (
              <motion.div
                className="flex items-center gap-2 bg-white/60 rounded-full px-4 py-1.5"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <span className="text-[20px]">⚡</span>
                <span className={cn('font-black text-[18px]', c.text)}>+{xp} XP</span>
              </motion.div>
            )}

            {/* Message */}
            {message && (
              <p className={cn('text-[15px] font-bold text-center max-w-[240px]', c.text)}>
                {message}
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
