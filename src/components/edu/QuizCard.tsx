import { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'

interface QuizCardProps {
  question: string
  options: string[]
  correctIndex: number
  questionNumber?: number
  totalQuestions?: number
  onAnswer: (correct: boolean) => void
}

const optionLabels = ['A', 'B', 'C', 'D']

type OptionState = 'idle' | 'selected' | 'correct' | 'incorrect'

export function QuizCard({
  question, options, correctIndex,
  questionNumber, totalQuestions, onAnswer,
}: QuizCardProps) {
  const [selected, setSelected] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)

  function handleSelect(idx: number) {
    if (answered) return
    setSelected(idx)
    setAnswered(true)
    setTimeout(() => onAnswer(idx === correctIndex), 800)
  }

  function getState(idx: number): OptionState {
    if (!answered) return selected === idx ? 'selected' : 'idle'
    if (idx === correctIndex) return 'correct'
    if (idx === selected)     return 'incorrect'
    return 'idle'
  }

  const stateStyle: Record<OptionState, string> = {
    idle:      'bg-white border-neutral-300 text-neutral-900 hover:border-brand-pink hover:bg-[#FFF0FA]',
    selected:  'bg-[#FFF0FA] border-brand-pink text-neutral-900',
    correct:   'bg-[#DCFCE7] border-[#16A34A] text-[#14532D]',
    incorrect: 'bg-[#FEE2E2] border-[#DC2626] text-[#7F1D1D]',
  }

  const stateIcon: Record<OptionState, string> = {
    idle: '', selected: '', correct: '✓', incorrect: '✗',
  }

  return (
    <div className="bg-white rounded-[var(--radius-sm)] border border-neutral-300 shadow-[var(--shadow-sm)] overflow-hidden">
      {/* Header bar */}
      {questionNumber && totalQuestions && (
        <div className="bg-brand-cream px-6 py-3 flex items-center justify-between">
          <span className="text-[13px] font-bold text-neutral-600">
            ข้อ {questionNumber} / {totalQuestions}
          </span>
          <div className="flex gap-1">
            {Array.from({ length: totalQuestions }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  'w-2 h-2 rounded-full',
                  i < questionNumber - 1 ? 'bg-[#22C55E]' :
                  i === questionNumber - 1 ? 'bg-brand-pink' : 'bg-neutral-300',
                )}
              />
            ))}
          </div>
        </div>
      )}

      {/* Question */}
      <div className="px-6 pt-6 pb-4">
        <p className="text-[20px] font-bold text-neutral-900 leading-snug">{question}</p>
      </div>

      {/* Options */}
      <div className="px-6 pb-6 grid grid-cols-1 gap-3">
        {options.map((opt, i) => {
          const state = getState(i)
          return (
            <motion.button
              key={i}
              onClick={() => handleSelect(i)}
              whileTap={!answered ? { scale: 0.98 } : {}}
              animate={
                state === 'correct'   ? { scale: [1, 1.03, 1] } :
                state === 'incorrect' ? { x: [-6, 6, -4, 4, 0] } : {}
              }
              transition={{ duration: 0.35 }}
              className={cn(
                'flex items-center gap-4 px-5 py-4 rounded-[var(--radius-xl)] border-2',
                'text-left font-bold text-[16px] transition-colors duration-200',
                'disabled:cursor-default',
                stateStyle[state],
              )}
              disabled={answered}
            >
              {/* Letter badge */}
              <span className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-[14px] font-black flex-shrink-0',
                state === 'correct'   ? 'bg-[#16A34A] text-white' :
                state === 'incorrect' ? 'bg-[#DC2626] text-white' :
                                        'bg-neutral-100 text-neutral-600',
              )}>
                {stateIcon[state] || optionLabels[i]}
              </span>
              {opt}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
