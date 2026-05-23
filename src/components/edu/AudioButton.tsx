import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, Pause } from 'lucide-react'
import { cn } from '@/lib/cn'

interface AudioButtonProps {
  label?: string
  size?: 'sm' | 'md' | 'lg'
  onPlay?: () => void
  className?: string
}

export function AudioButton({ label, size = 'md', onPlay, className }: AudioButtonProps) {
  const [playing, setPlaying] = useState(false)

  function handleClick() {
    if (playing) { setPlaying(false); return }
    setPlaying(true)
    onPlay?.()
    // Auto-stop after 2.5s (simulate audio)
    setTimeout(() => setPlaying(false), 2500)
  }

  const sizeMap = {
    sm: { btn: 'w-10 h-10', icon: 14, bar: 'h-3', label: 'text-[12px]' },
    md: { btn: 'w-14 h-14', icon: 20, bar: 'h-4', label: 'text-[15px]' },
    lg: { btn: 'w-18 h-18', icon: 26, bar: 'h-5', label: 'text-[18px]' },
  }
  const s = sizeMap[size]

  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <motion.button
        onClick={handleClick}
        whileTap={{ scale: 0.92 }}
        className={cn(
          'rounded-full flex items-center justify-center',
          'border-2 transition-colors duration-200 cursor-pointer',
          s.btn,
          playing
            ? 'bg-brand-pink border-brand-pink text-white shadow-[0_0_0_6px_rgba(255,68,203,0.2)]'
            : 'bg-white border-brand-pink text-brand-pink hover:bg-[#FFF0FA]',
        )}
      >
        {playing ? <Pause size={s.icon} /> : <Volume2 size={s.icon} />}
      </motion.button>

      {/* Waveform bars */}
      <AnimatePresence>
        {playing && (
          <motion.div
            className="flex items-end gap-[3px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[0.4, 0.8, 1, 0.6, 1, 0.7, 0.4].map((h, i) => (
              <motion.div
                key={i}
                className={cn('w-[4px] rounded-full bg-brand-pink', s.bar)}
                animate={{ scaleY: [h, h * 0.3, h * 1.2, h * 0.5, h] }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.08,
                  ease: 'easeInOut',
                }}
                style={{ transformOrigin: 'bottom' }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {label && (
        <span className={cn('font-bold text-neutral-700 text-center', s.label)}>
          {label}
        </span>
      )}
    </div>
  )
}
