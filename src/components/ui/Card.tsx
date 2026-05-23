import type { HTMLAttributes } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'

/* ── Base Card ───────────────────────────────────── */
interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean
}

export function Card({ hover = false, className, children, ...props }: CardProps) {
  if (hover) {
    return (
      <motion.div
        whileHover={{ y: -4, boxShadow: '0px 4px 16px rgba(0,0,0,0.12)', borderColor: '#51545C' }}
        transition={{ duration: 0.2, ease: [0, 0, 0.58, 1] }}
        className={cn(
          'bg-white border border-neutral-300 rounded-[var(--radius-sm)] overflow-hidden',
          'shadow-[var(--shadow-sm)] cursor-pointer',
          className,
        )}
        {...(props as any)}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <div
      className={cn(
        'bg-white border border-neutral-300 rounded-[var(--radius-sm)] overflow-hidden',
        'shadow-[var(--shadow-sm)]',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/* ── Vendor Category Card ────────────────────────── */
export type VendorCardColor = 'blue' | 'yellow' | 'orange' | 'taupe' | 'cream'

interface VendorCardProps extends HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  tag?: string
  color?: VendorCardColor
  cta?: string
}

const colorClasses: Record<VendorCardColor, string> = {
  blue:   'bg-accent-blue   text-neutral-900',
  yellow: 'bg-accent-yellow text-neutral-900',
  orange: 'bg-accent-orange text-neutral-900',
  taupe:  'bg-accent-taupe  text-neutral-900',
  cream:  'bg-brand-cream   text-neutral-900 border border-neutral-300',
}

export function VendorCard({
  title, description, tag, color = 'blue',
  cta = 'Browse', className, ...props
}: VendorCardProps) {
  return (
    <motion.div
      whileHover={{ y: -6, boxShadow: '0px 8px 24px rgba(0,0,0,0.15)' }}
      transition={{ duration: 0.2, ease: [0, 0, 0.58, 1] }}
      className={cn(
        'rounded-[var(--radius-sm)] p-6 min-h-[220px] flex flex-col justify-between',
        'shadow-[var(--shadow-sm)] cursor-pointer',
        colorClasses[color],
        className,
      )}
      {...(props as any)}
    >
      <div>
        {tag && (
          <p className="text-[10px] font-bold tracking-[0.12em] uppercase opacity-70 mb-1">{tag}</p>
        )}
        <h3 className="text-[24px] font-bold leading-tight font-[var(--font-display)]">{title}</h3>
        {description && <p className="text-sm mt-2 opacity-80">{description}</p>}
      </div>
      <button className="self-start mt-4 border-2 border-current rounded-full px-5 py-2 text-[13px] font-bold bg-transparent hover:bg-black/10 transition-colors cursor-pointer">
        {cta}
      </button>
    </motion.div>
  )
}

/* ── Feature Card ────────────────────────────────── */
interface FeatureCardProps extends HTMLAttributes<HTMLDivElement> {
  tag?: string
  title: string
  body?: string
  cta?: string
  onCtaClick?: () => void
}

export function FeatureCard({
  tag, title, body, cta = 'Get started', onCtaClick, className, ...props
}: FeatureCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0px 4px 16px rgba(0,0,0,0.12)', borderColor: '#51545C' }}
      transition={{ duration: 0.2, ease: [0, 0, 0.58, 1] }}
      className={cn(
        'bg-white border border-neutral-300 rounded-[var(--radius-sm)] p-8 text-center',
        'shadow-[var(--shadow-sm)]',
        className,
      )}
      {...(props as any)}
    >
      {tag && (
        <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-neutral-600 mb-2">{tag}</p>
      )}
      <h3 className="text-[22px] font-bold text-neutral-900 mb-3 font-[var(--font-display)]">{title}</h3>
      {body && <p className="text-[14px] text-neutral-600 leading-relaxed mb-6">{body}</p>}
      {cta && (
        <button
          onClick={onCtaClick}
          className="border border-brand-pink text-brand-pink rounded-full px-6 py-2 text-[14px] font-bold bg-transparent hover:bg-brand-pink hover:text-white transition-colors cursor-pointer"
        >
          {cta}
        </button>
      )}
    </motion.div>
  )
}
