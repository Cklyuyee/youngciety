import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

export type BadgeVariant =
  | 'pink'
  | 'success'
  | 'warning'
  | 'ocean'
  | 'dark'
  | 'white'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

/**
 * The Knot badge spec:
 * Success — bg #E8F5E9, text #2E7D32, border #2E7D32
 * Warning — bg #FFF3CD, text #FBBB03, border #FBBB03
 * Pink    — soft magenta tint
 * Ocean   — ocean blue tint
 */
const variantClasses: Record<BadgeVariant, string> = {
  pink:
    'bg-[#FEBBF7] text-[#AA1585] border border-[#FF44CB]',
  success:
    'bg-[#E8F5E9] text-[#2E7D32] border border-[#2E7D32]',
  warning:
    'bg-[#FFF3CD] text-[#9A6F00] border border-[#FBBB03]',
  ocean:
    'bg-[#EAF3FD] text-[#0073E6] border border-[#0073E6]',
  dark:
    'bg-neutral-900 text-white border border-neutral-900',
  white:
    'bg-white text-neutral-900 border border-neutral-300',
}

export function Badge({ variant = 'pink', className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-[4px] px-2 py-0.5 text-[12px] font-bold',
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}
