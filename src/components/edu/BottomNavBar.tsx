import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'

export interface NavItem {
  id: string
  label: string
  icon: React.ReactNode
  badge?: number
}

interface BottomNavBarProps {
  items: NavItem[]
  active: string
  onChange: (id: string) => void
  className?: string
}

export function BottomNavBar({ items, active, onChange, className }: BottomNavBarProps) {
  return (
    <nav className={cn(
      'fixed bottom-0 left-0 right-0 z-40',
      'bg-white border-t border-neutral-200',
      'shadow-[0_-2px_16px_rgba(0,0,0,0.08)]',
      'px-2 pb-safe',
      className,
    )}>
      <div className="flex items-stretch justify-around h-16">
        {items.map(item => {
          const isActive = item.id === active
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className={cn(
                'relative flex flex-col items-center justify-center gap-0.5',
                'flex-1 px-1 cursor-pointer transition-colors duration-150',
                'min-w-[48px]',
              )}
            >
              {/* Active pill indicator */}
              {isActive && (
                <motion.div
                  layoutId="nav-active-bg"
                  className="absolute top-2 inset-x-2 h-8 rounded-full bg-[#FFF0FA]"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}

              {/* Badge */}
              {item.badge != null && item.badge > 0 && (
                <span className="absolute top-1.5 right-2 min-w-[18px] h-[18px] rounded-full bg-brand-pink text-white text-[10px] font-black flex items-center justify-center px-1 z-10">
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}

              {/* Icon */}
              <span className={cn(
                'relative z-10 transition-colors duration-150',
                isActive ? 'text-brand-pink' : 'text-neutral-400',
              )}>
                {item.icon}
              </span>

              {/* Label */}
              <span className={cn(
                'relative z-10 text-[10px] font-bold transition-colors duration-150',
                isActive ? 'text-brand-pink' : 'text-neutral-400',
              )}>
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
