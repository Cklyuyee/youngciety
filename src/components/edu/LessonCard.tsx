import { motion } from 'framer-motion'
import { Lock, CheckCircle2, Clock, Zap } from 'lucide-react'
import { cn } from '@/lib/cn'

export type LessonStatus = 'locked' | 'available' | 'completed'

interface LessonCardProps {
  title: string
  subject: string
  icon: string          // emoji or text icon
  xp: number
  duration: string      // e.g. "5 นาที"
  status?: LessonStatus
  stars?: number        // 0–3
  onClick?: () => void
  className?: string
}

const statusStyle: Record<LessonStatus, { card: string; badge: string; label: string }> = {
  locked: {
    card:  'bg-neutral-100 border-neutral-200 opacity-60',
    badge: 'bg-neutral-200 text-neutral-600',
    label: 'ล็อกอยู่',
  },
  available: {
    card:  'bg-white border-neutral-300 cursor-pointer',
    badge: 'bg-[#FEBBF7] text-brand-pink',
    label: 'เริ่มเรียน',
  },
  completed: {
    card:  'bg-white border-[#BBF7D0] cursor-pointer',
    badge: 'bg-[#DCFCE7] text-[#16A34A]',
    label: 'เรียนซ้ำ',
  },
}

export function LessonCard({
  title, subject, icon, xp, duration,
  status = 'available', stars = 0, onClick, className,
}: LessonCardProps) {
  const s = statusStyle[status]

  return (
    <motion.div
      onClick={status !== 'locked' ? onClick : undefined}
      whileHover={status !== 'locked' ? { y: -4, boxShadow: '0px 8px 24px rgba(0,0,0,0.12)' } : {}}
      whileTap={status !== 'locked' ? { scale: 0.98 } : {}}
      transition={{ duration: 0.2 }}
      className={cn(
        'relative rounded-[var(--radius-sm)] border p-5 shadow-[var(--shadow-sm)]',
        'transition-colors duration-200',
        s.card, className,
      )}
    >
      {/* Status icon top-right */}
      <div className="absolute top-4 right-4">
        {status === 'locked'    && <Lock    size={18} className="text-neutral-400" />}
        {status === 'completed' && <CheckCircle2 size={18} className="text-[#16A34A]" />}
      </div>

      {/* Icon */}
      <div className="text-4xl mb-3 leading-none">{icon}</div>

      {/* Subject label */}
      <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-neutral-500 mb-1">
        {subject}
      </p>

      {/* Title */}
      <h3 className="text-[18px] font-bold text-neutral-900 mb-3 leading-snug pr-6">
        {title}
      </h3>

      {/* Stars */}
      {status === 'completed' && (
        <div className="flex gap-0.5 mb-3">
          {[0, 1, 2].map(i => (
            <span key={i} className={i < stars ? 'text-accent-yellow text-lg' : 'text-neutral-300 text-lg'}>
              ★
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-neutral-100">
        <div className="flex items-center gap-3 text-[12px] text-neutral-500">
          <span className="flex items-center gap-1">
            <Clock size={12} /> {duration}
          </span>
          <span className="flex items-center gap-1 font-bold text-accent-amber">
            <Zap size={12} /> {xp} XP
          </span>
        </div>
        <span className={cn('text-[11px] font-bold px-2.5 py-1 rounded-full', s.badge)}>
          {s.label}
        </span>
      </div>
    </motion.div>
  )
}
