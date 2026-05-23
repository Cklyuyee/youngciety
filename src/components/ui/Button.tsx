import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'

export type ButtonVariant = 'primary' | 'outline' | 'dark' | 'ghost-pink' | 'white'
export type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-brand-pink border-brand-pink text-white ' +
    'hover:bg-[#E63AAE] hover:border-[#E63AAE] ' +
    'active:bg-[#CC2E96] active:border-[#CC2E96] ' +
    'disabled:bg-[#FFB3E0] disabled:border-[#FFB3E0]',
  outline:
    'bg-transparent border-neutral-600 text-neutral-900 ' +
    'hover:bg-neutral-100 hover:border-neutral-900 ' +
    'active:bg-neutral-300',
  dark:
    'bg-neutral-900 border-neutral-900 text-white ' +
    'hover:bg-neutral-700 hover:border-neutral-700',
  'ghost-pink':
    'bg-transparent border-brand-pink text-brand-pink ' +
    'hover:bg-brand-pink hover:text-white',
  white:
    'bg-white border-white text-neutral-900 ' +
    'hover:bg-neutral-100',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-10 px-6  text-[14px] font-bold',
  md: 'h-12 px-8  text-[16px] font-bold',
  lg: 'h-12 px-10 text-[16px] font-bold',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, disabled, className, children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        disabled={disabled || loading}
        whileTap={disabled || loading ? {} : { scale: 0.97 }}
        transition={{ duration: 0.1 }}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-full cursor-pointer',
          'border transition-colors duration-200 select-none',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...(props as any)}
      >
        {loading ? (
          <motion.span
            className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
          />
        ) : null}
        {children}
      </motion.button>
    )
  },
)
Button.displayName = 'Button'
