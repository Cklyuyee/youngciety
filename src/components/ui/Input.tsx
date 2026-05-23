import { type InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  helper?: string
  error?: string
}

/**
 * The Knot input spec:
 * border-radius: 50px (full pill)
 * border: 1px solid #707070
 * focus: border #FF44CB + box-shadow 0px 0px 0px 2px #FEBBF7
 * error: border #FF6F00
 * placeholder: #51545C at 60% opacity
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, helper, error, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label
            htmlFor={inputId}
            className="text-[14px] font-bold text-neutral-900"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'h-12 px-5 rounded-full border bg-white',
            'font-[var(--font-sans)] text-[16px] text-neutral-900 outline-none',
            'placeholder:text-neutral-600/60',
            'transition-[border-color,box-shadow] duration-200',
            error
              ? 'border-error focus:border-error focus:shadow-[0_0_0_2px_rgba(255,111,0,0.25)]'
              : 'border-[#707070] hover:border-neutral-900 focus:border-brand-pink focus:shadow-[var(--shadow-focus)]',
            'disabled:bg-neutral-100 disabled:opacity-60 disabled:cursor-not-allowed',
            className,
          )}
          {...props}
        />
        {error && <p className="text-[12px] text-error">{error}</p>}
        {!error && helper && <p className="text-[12px] text-neutral-600">{helper}</p>}
      </div>
    )
  },
)
Input.displayName = 'Input'
