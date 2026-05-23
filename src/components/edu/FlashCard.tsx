import { useState } from 'react'
import { motion } from 'framer-motion'
import { RefreshCw } from 'lucide-react'
import { cn } from '@/lib/cn'

interface FlashCardProps {
  front: React.ReactNode
  back: React.ReactNode
  frontBg?: string
  backBg?: string
  hint?: string
  className?: string
}

export function FlashCard({
  front, back,
  frontBg = 'bg-brand-cream',
  backBg = 'bg-[#EFF6FF]',
  hint = 'แตะเพื่อดูคำตอบ',
  className,
}: FlashCardProps) {
  const [flipped, setFlipped] = useState(false)

  return (
    <div
      className={cn('relative cursor-pointer select-none', className)}
      style={{ perspective: 1000 }}
      onClick={() => setFlipped(f => !f)}
    >
      <motion.div
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="relative w-full"
      >
        {/* Front */}
        <div
          className={cn(
            'rounded-[var(--radius-sm)] border border-neutral-300',
            'shadow-[var(--shadow-sm)] p-8 min-h-[200px]',
            'flex flex-col items-center justify-center text-center',
            frontBg,
          )}
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="text-[28px] font-bold text-neutral-900 leading-snug mb-4">
            {front}
          </div>
          <p className="text-[12px] text-neutral-500 flex items-center gap-1.5">
            <RefreshCw size={12} /> {hint}
          </p>
        </div>

        {/* Back */}
        <div
          className={cn(
            'absolute inset-0 rounded-[var(--radius-sm)] border border-neutral-300',
            'shadow-[var(--shadow-md)] p-8 min-h-[200px]',
            'flex flex-col items-center justify-center text-center',
            backBg,
          )}
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className="text-[28px] font-bold text-neutral-900 leading-snug mb-4">
            {back}
          </div>
          <p className="text-[12px] text-neutral-500 flex items-center gap-1.5">
            <RefreshCw size={12} /> แตะเพื่อกลับ
          </p>
        </div>
      </motion.div>
    </div>
  )
}
